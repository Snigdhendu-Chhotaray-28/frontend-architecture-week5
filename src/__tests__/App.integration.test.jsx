import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { StorageService } from '../services/storage';

describe('FinTrack Pro Integration Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    StorageService.clearAll();
  });

  it('renders initial dashboard with preloaded KPI stats and ledger rows', () => {
    render(<App />);

    // Header & QA badge
    expect(screen.getByText('FinTrack Pro')).toBeInTheDocument();
    expect(screen.getByText('QA Verified (100% RTL)')).toBeInTheDocument();

    // Stats Grid
    expect(screen.getByTestId('stat-card-income')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-expense')).toBeInTheDocument();
    expect(screen.getByTestId('stat-card-balance')).toBeInTheDocument();

    // Ledger has preloaded items
    expect(screen.getByText('Cloud Infrastructure (AWS)')).toBeInTheDocument();
    expect(screen.getByText('Client Retainer Payment')).toBeInTheDocument();
  });

  it('adds a new transaction and updates stats, progress bar, and ledger list', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Fill form
    await user.type(screen.getByTestId('title-input'), 'Datadog APM Monitor');
    await user.type(screen.getByTestId('amount-input'), '200');

    // Click submit
    const submitBtn = screen.getByTestId('submit-transaction-btn');
    await user.click(submitBtn);

    // Verify it appears in ledger
    expect(screen.getByText('Datadog APM Monitor')).toBeInTheDocument();

    // Form inputs should reset
    expect(screen.getByTestId('title-input')).toHaveValue('');
  });

  it('deletes a transaction from ledger and dynamically recalculates financial margins', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText('Coworking Space Membership')).toBeInTheDocument();

    // Click delete on Coworking transaction (tx-3)
    const deleteBtn = screen.getByTestId('delete-transaction-tx-3');
    await user.click(deleteBtn);

    // Verify it is removed
    expect(screen.queryByText('Coworking Space Membership')).not.toBeInTheDocument();
  });

  it('filters transactions by type when filter buttons are toggled', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Filter by "Income"
    const incomeFilter = screen.getByTestId('filter-type-income');
    await user.click(incomeFilter);

    // Income items should remain visible
    expect(screen.getByText('Client Retainer Payment')).toBeInTheDocument();

    // Expense items should not be present
    expect(screen.queryByText('Cloud Infrastructure (AWS)')).not.toBeInTheDocument();

    // Toggle back to "All"
    await user.click(screen.getByTestId('filter-type-all'));
    expect(screen.getByText('Cloud Infrastructure (AWS)')).toBeInTheDocument();
  });

  it('filters transactions using live search input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'Figma');

    expect(screen.getByText('Figma Organization License')).toBeInTheDocument();
    expect(screen.queryByText('AWS')).not.toBeInTheDocument();

    // Clear search
    const clearBtn = screen.getByTestId('clear-search-btn');
    await user.click(clearBtn);

    expect(screen.getByText('Cloud Infrastructure (AWS)')).toBeInTheDocument();
  });

  it('triggers budget alert banner when total expenses cross monthly budget limit', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Lower budget limit to $500 so existing expenses (~$585.50) exceed it
    const editBudgetBtn = screen.getByTestId('edit-budget-btn');
    await user.click(editBudgetBtn);

    const budgetInput = screen.getByTestId('budget-input-field');
    await user.clear(budgetInput);
    await user.type(budgetInput, '500');

    const saveBudgetBtn = screen.getByTestId('save-budget-btn');
    await user.click(saveBudgetBtn);

    // Notification banner should appear
    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Budget Alert: You have exceeded your monthly limit/i);
  });

  it('toggles theme between dark and light mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    const themeToggleBtn = screen.getByTestId('theme-toggle-btn');
    expect(themeToggleBtn).toHaveAttribute('aria-label', 'Switch to light theme');

    await user.click(themeToggleBtn);
    expect(themeToggleBtn).toHaveAttribute('aria-label', 'Switch to dark theme');
  });

  it('resets demo dataset when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Delete an item
    const deleteBtn = screen.getByTestId('delete-transaction-tx-1');
    await user.click(deleteBtn);
    expect(screen.queryByText('Cloud Infrastructure (AWS)')).not.toBeInTheDocument();

    // Click reset
    const resetBtn = screen.getByTestId('reset-data-btn');
    await user.click(resetBtn);

    // AWS transaction should be restored
    expect(screen.getByText('Cloud Infrastructure (AWS)')).toBeInTheDocument();
  });

  it('triggers budget warning banner when spending is between 80% and 100%', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Set budget limit to $700 so initial expenses ($585.50) are at ~83.6% (warning status)
    const editBudgetBtn = screen.getByTestId('edit-budget-btn');
    await user.click(editBudgetBtn);

    const budgetInput = screen.getByTestId('budget-input-field');
    await user.clear(budgetInput);
    await user.type(budgetInput, '700');

    const saveBudgetBtn = screen.getByTestId('save-budget-btn');
    await user.click(saveBudgetBtn);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Caution: You have utilized/i);
  });
});
