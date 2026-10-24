import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithTheme } from '../../test-utils';
import { StatCard } from '../StatCard';

describe('StatCard Component', () => {
  it('renders title and formatted currency correctly', () => {
    renderWithTheme(
      <StatCard
        title="Total Inflow"
        amount={4250.75}
        variant="income"
        subtitle="Verified deposits"
      />
    );

    expect(screen.getByText('Total Inflow')).toBeInTheDocument();
    expect(screen.getByText('$4,250.75')).toBeInTheDocument();
    expect(screen.getByText('Verified deposits')).toBeInTheDocument();
  });

  it('renders percentage format when isPercentage is true', () => {
    renderWithTheme(
      <StatCard
        title="Savings Rate"
        amount={68}
        variant="savings"
        isPercentage
      />
    );

    expect(screen.getByText('68%')).toBeInTheDocument();
  });

  it('includes accessible region role and descriptive aria-label', () => {
    renderWithTheme(
      <StatCard
        title="Net Liquidity"
        amount={1200}
        variant="balance"
      />
    );

    const card = screen.getByRole('region', { name: /Net Liquidity: \$1,200\.00/i });
    expect(card).toBeInTheDocument();
  });

  it('renders raw string value directly when amount is not a number and not percentage', () => {
    renderWithTheme(
      <StatCard
        title="Pending Approvals"
        amount="Pending"
        variant="balance"
      />
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });
});
