import React from 'react';
import styled from 'styled-components';
import { PieChart } from 'lucide-react';
import { calculateCategoryBreakdown, formatCurrency } from '../utils/finance';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
  margin-bottom: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const BreakdownList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CategoryRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const RowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
`;

const CategoryName = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const CategoryValues = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CategoryTotal = styled.span`
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const PercentageBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.primaryLight};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.full};
  width: ${({ $percentage }) => $percentage}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  transition: width ${({ theme }) => theme.transitions.normal};
`;

const EmptyState = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
`;

export const CategoryBreakdown = ({ transactions = [] }) => {
  const breakdown = calculateCategoryBreakdown(transactions);

  return (
    <Card id="category-breakdown-card" data-testid="category-breakdown-card">
      <Header>
        <PieChart size={20} color="#6366f1" aria-hidden="true" />
        <Title>Expense Allocation</Title>
      </Header>

      {breakdown.length === 0 ? (
        <EmptyState data-testid="empty-breakdown">
          No expense transactions recorded yet. Add an expense to view category distribution.
        </EmptyState>
      ) : (
        <BreakdownList data-testid="category-breakdown-list">
          {breakdown.map((item) => (
            <CategoryRow key={item.category} data-testid={`category-row-${item.category}`}>
              <RowHeader>
                <CategoryName>{item.category}</CategoryName>
                <CategoryValues>
                  <CategoryTotal>{formatCurrency(item.total)}</CategoryTotal>
                  <PercentageBadge>{item.percentage}%</PercentageBadge>
                </CategoryValues>
              </RowHeader>
              <ProgressBar>
                <ProgressFill $percentage={item.percentage} />
              </ProgressBar>
            </CategoryRow>
          ))}
        </BreakdownList>
      )}
    </Card>
  );
};
