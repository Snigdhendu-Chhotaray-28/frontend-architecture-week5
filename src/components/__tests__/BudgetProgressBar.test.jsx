import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test-utils';
import { BudgetProgressBar } from '../BudgetProgressBar';

describe('BudgetProgressBar Component', () => {
  it('renders progress bar with appropriate ARIA accessibility attributes', () => {
    renderWithTheme(
      <BudgetProgressBar totalExpense={1000} budgetLimit={2000} />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
    expect(progressBar).toHaveAttribute('aria-valuemin', '0');
    expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('Healthy Budget')).toBeInTheDocument();
  });

  it('displays warning badge and status when expense is 80% or greater', () => {
    renderWithTheme(
      <BudgetProgressBar totalExpense={1600} budgetLimit={2000} />
    );

    expect(screen.getByText('80% Warning')).toBeInTheDocument();
    expect(screen.getByTestId('budget-remaining-text')).toHaveTextContent('$400.00');
  });

  it('displays over budget badge when expenses exceed budget limit', () => {
    renderWithTheme(
      <BudgetProgressBar totalExpense={2400} budgetLimit={2000} />
    );

    expect(screen.getByText('Over Budget')).toBeInTheDocument();
    expect(screen.getByTestId('budget-remaining-text')).toHaveTextContent('$0.00');
  });

  it('allows user to enter inline edit mode and submit updated budget limit', async () => {
    const user = userEvent.setup();
    const handleUpdateBudget = vi.fn();

    renderWithTheme(
      <BudgetProgressBar
        totalExpense={500}
        budgetLimit={2500}
        onUpdateBudget={handleUpdateBudget}
      />
    );

    const editBtn = screen.getByTestId('edit-budget-btn');
    await user.click(editBtn);

    const budgetInput = screen.getByTestId('budget-input-field');
    expect(budgetInput).toBeInTheDocument();

    await user.clear(budgetInput);
    await user.type(budgetInput, '3500');

    const saveBtn = screen.getByTestId('save-budget-btn');
    await user.click(saveBtn);

    expect(handleUpdateBudget).toHaveBeenCalledTimes(1);
    expect(handleUpdateBudget).toHaveBeenCalledWith(3500);
  });
});
