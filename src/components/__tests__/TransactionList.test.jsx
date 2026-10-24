import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test-utils';
import { TransactionList } from '../TransactionList';

const sampleTransactions = [
  {
    id: 'tx-1',
    title: 'Salary Deposit',
    amount: 3500,
    type: 'income',
    category: 'Salary',
    date: '2026-10-01',
    notes: 'Monthly salary',
  },
  {
    id: 'tx-2',
    title: 'AWS Cloud Hosting',
    amount: 120.5,
    type: 'expense',
    category: 'Subscriptions',
    date: '2026-10-05',
    notes: 'Server infrastructure',
  },
  {
    id: 'tx-3',
    title: 'Coffee Beans',
    amount: 25.0,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-10-10',
    notes: 'Office supplies',
  },
];

describe('TransactionList Component', () => {
  it('renders list of transactions with count indicator', () => {
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={vi.fn()}
      />
    );

    expect(screen.getByText('Ledger & History')).toBeInTheDocument();
    expect(screen.getByTestId('tx-count-badge')).toHaveTextContent('3 of 3');
    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.getByText('AWS Cloud Hosting')).toBeInTheDocument();
    expect(screen.getByText('Coffee Beans')).toBeInTheDocument();
  });

  it('renders empty state when transaction list is completely empty', () => {
    renderWithTheme(
      <TransactionList
        transactions={[]}
        onDeleteTransaction={vi.fn()}
      />
    );

    expect(screen.getByTestId('empty-transactions-state')).toBeInTheDocument();
    expect(screen.getByText('No Transactions Found')).toBeInTheDocument();
    expect(
      screen.getByText('Your transaction ledger is empty. Start by logging your first transaction!')
    ).toBeInTheDocument();
  });

  it('renders filter empty state when search query matches no transactions', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={vi.fn()}
      />
    );

    const searchInput = screen.getByTestId('search-input');
    await user.type(searchInput, 'NonExistentItemXYZ');

    expect(screen.getByTestId('empty-transactions-state')).toBeInTheDocument();
    expect(
      screen.getByText('No transactions match the selected filter or search criteria.')
    ).toBeInTheDocument();
  });

  it('filters transactions by type (income only)', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={vi.fn()}
      />
    );

    const incomeFilterBtn = screen.getByTestId('filter-type-income');
    await user.click(incomeFilterBtn);

    expect(screen.getByText('Salary Deposit')).toBeInTheDocument();
    expect(screen.queryByText('AWS Cloud Hosting')).not.toBeInTheDocument();
    expect(screen.queryByText('Coffee Beans')).not.toBeInTheDocument();
  });

  it('sorts transactions by title ascending (A to Z)', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={vi.fn()}
      />
    );

    const sortSelect = screen.getByTestId('sort-select');
    await user.selectOptions(sortSelect, 'title-asc');

    expect(screen.getByTestId('transaction-item-tx-2')).toHaveTextContent('AWS Cloud Hosting');
    expect(screen.getByTestId('transaction-item-tx-3')).toHaveTextContent('Coffee Beans');
    expect(screen.getByTestId('transaction-item-tx-1')).toHaveTextContent('Salary Deposit');
  });

  it('sorts transactions by amount ascending (Low to High)', async () => {
    const user = userEvent.setup();
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={vi.fn()}
      />
    );

    const sortSelect = screen.getByTestId('sort-select');
    await user.selectOptions(sortSelect, 'amount-asc');

    expect(screen.getByTestId('transaction-item-tx-3')).toHaveTextContent('Coffee Beans');
    expect(screen.getByTestId('transaction-item-tx-2')).toHaveTextContent('AWS Cloud Hosting');
    expect(screen.getByTestId('transaction-item-tx-1')).toHaveTextContent('Salary Deposit');
  });

  it('triggers onDelete callback when transaction delete button is clicked', async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();
    renderWithTheme(
      <TransactionList
        transactions={sampleTransactions}
        onDeleteTransaction={handleDelete}
      />
    );

    const deleteBtn = screen.getByTestId('delete-transaction-tx-1');
    await user.click(deleteBtn);

    expect(handleDelete).toHaveBeenCalledWith('tx-1');
  });
});
