import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import { CategoryBreakdown } from '../CategoryBreakdown';

describe('CategoryBreakdown Component', () => {
  it('renders breakdown rows when expense transactions exist', () => {
    const transactions = [
      { amount: 500, type: 'expense', category: 'Software' },
      { amount: 500, type: 'expense', category: 'Office' },
    ];

    renderWithTheme(<CategoryBreakdown transactions={transactions} />);

    expect(screen.getByText('Expense Allocation')).toBeInTheDocument();
    expect(screen.getByText('Software')).toBeInTheDocument();
    expect(screen.getByText('Office')).toBeInTheDocument();
    expect(screen.getAllByText('50%')).toHaveLength(2);
  });

  it('renders empty state when no expenses are present', () => {
    const transactions = [
      { amount: 2000, type: 'income', category: 'Salary' },
    ];

    renderWithTheme(<CategoryBreakdown transactions={transactions} />);

    expect(screen.getByTestId('empty-breakdown')).toBeInTheDocument();
    expect(
      screen.getByText(/No expense transactions recorded yet/i)
    ).toBeInTheDocument();
  });
});
