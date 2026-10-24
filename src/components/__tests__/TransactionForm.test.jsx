import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test-utils';
import { TransactionForm } from '../TransactionForm';

describe('TransactionForm Component', () => {
  it('renders all inputs and default submit button', () => {
    renderWithTheme(<TransactionForm onAddTransaction={vi.fn()} />);

    expect(screen.getByTestId('title-input')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByTestId('date-input')).toBeInTheDocument();
    expect(screen.getByTestId('notes-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-transaction-btn')).toHaveTextContent('Record Expense');
  });

  it('switches between income and expense types and updates categories', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TransactionForm onAddTransaction={vi.fn()} />);

    const incomeBtn = screen.getByTestId('type-income-btn');
    await user.click(incomeBtn);

    expect(screen.getByTestId('submit-transaction-btn')).toHaveTextContent('Record Income');
    expect(screen.getByText('Consulting')).toBeInTheDocument();
  });

  it('validates required fields and shows inline errors when submitted blank', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    renderWithTheme(<TransactionForm onAddTransaction={handleAdd} />);

    const submitBtn = screen.getByTestId('submit-transaction-btn');
    await user.click(submitBtn);

    expect(handleAdd).not.toHaveBeenCalled();
    expect(screen.getByTestId('title-error')).toHaveTextContent('Title is required');
    expect(screen.getByTestId('amount-error')).toHaveTextContent('Valid amount is required');

    const titleInput = screen.getByTestId('title-input');
    expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  });

  it('successfully submits valid transaction and resets form inputs', async () => {
    const user = userEvent.setup();
    const handleAdd = vi.fn();
    renderWithTheme(<TransactionForm onAddTransaction={handleAdd} />);

    await user.type(screen.getByTestId('title-input'), 'Vercel Pro Team');
    await user.type(screen.getByTestId('amount-input'), '40');
    await user.type(screen.getByTestId('notes-input'), 'Frontend preview branches');

    const submitBtn = screen.getByTestId('submit-transaction-btn');
    await user.click(submitBtn);

    expect(handleAdd).toHaveBeenCalledTimes(1);
    const submittedData = handleAdd.mock.calls[0][0];
    expect(submittedData.title).toBe('Vercel Pro Team');
    expect(submittedData.amount).toBe(40);
    expect(submittedData.notes).toBe('Frontend preview branches');
    expect(submittedData.type).toBe('expense');

    // Verify reset
    expect(screen.getByTestId('title-input')).toHaveValue('');
    expect(screen.getByTestId('amount-input')).toHaveValue(null);
  });

  it('displays inline error when date field is emptied', async () => {
    const user = userEvent.setup();
    renderWithTheme(<TransactionForm onAddTransaction={vi.fn()} />);

    const dateInput = screen.getByTestId('date-input');
    await user.clear(dateInput);

    const submitBtn = screen.getByTestId('submit-transaction-btn');
    await user.click(submitBtn);

    expect(screen.getByTestId('date-error')).toHaveTextContent('Date is required');
  });
});
