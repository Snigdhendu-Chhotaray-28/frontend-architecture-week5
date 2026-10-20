import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test-utils';
import { TransactionItem } from '../TransactionItem';

describe('TransactionItem Component', () => {
  const mockTransaction = {
    id: 'tx-101',
    title: 'Cloudflare Workers Subscription',
    amount: 25.0,
    type: 'expense',
    category: 'Software',
    date: '2026-10-18',
    notes: 'Edge API backend',
  };

  it('renders all transaction details correctly', () => {
    renderWithTheme(<TransactionItem transaction={mockTransaction} />);

    expect(screen.getByText('Cloudflare Workers Subscription')).toBeInTheDocument();
    expect(screen.getByText('Software')).toBeInTheDocument();
    expect(screen.getByText('2026-10-18')).toBeInTheDocument();
    expect(screen.getByText('• Edge API backend')).toBeInTheDocument();
    expect(screen.getByTestId('transaction-amount-tx-101')).toHaveTextContent('-$25.00');
  });

  it('formats income transaction with plus sign', () => {
    const incomeTx = {
      ...mockTransaction,
      id: 'tx-102',
      type: 'income',
      amount: 1500,
    };

    renderWithTheme(<TransactionItem transaction={incomeTx} />);
    expect(screen.getByTestId('transaction-amount-tx-102')).toHaveTextContent('+$1,500.00');
  });

  it('invokes onDelete callback with transaction id when delete button is pressed', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    renderWithTheme(
      <TransactionItem transaction={mockTransaction} onDelete={handleDelete} />
    );

    const deleteBtn = screen.getByTestId('delete-transaction-tx-101');
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledTimes(1);
    expect(handleDelete).toHaveBeenCalledWith('tx-101');
  });
});
