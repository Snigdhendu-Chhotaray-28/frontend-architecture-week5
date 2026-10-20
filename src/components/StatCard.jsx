import React from 'react';
import styled, { css } from 'styled-components';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: transform ${({ theme }) => theme.transitions.normal}, box-shadow ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.colors.shadowMd};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    ${({ $variant, theme }) => {
      switch ($variant) {
        case 'income':
          return css`background: ${theme.colors.income};`;
        case 'expense':
          return css`background: ${theme.colors.expense};`;
        case 'savings':
          return css`background: ${theme.colors.secondary};`;
        default:
          return css`background: ${theme.colors.primary};`;
      }
    }}
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CardTitle = styled.h3`
  font-size: 0.88rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const IconWrapper = styled.div`
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'income':
        return css`
          background: ${theme.colors.incomeLight};
          color: ${theme.colors.income};
        `;
      case 'expense':
        return css`
          background: ${theme.colors.expenseLight};
          color: ${theme.colors.expense};
        `;
      case 'savings':
        return css`
          background: rgba(6, 182, 212, 0.15);
          color: ${theme.colors.secondary};
        `;
      default:
        return css`
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        `;
    }
  }}
`;

const Amount = styled.div`
  font-size: 1.85rem;
  font-weight: 800;
  font-family: ${({ theme }) => theme.typography.fontMono};
  letter-spacing: -0.03em;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 6px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const StatCard = ({
  title,
  amount,
  variant = 'balance',
  subtitle,
  isPercentage = false,
  id,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'income':
        return <TrendingUp size={20} aria-hidden="true" />;
      case 'expense':
        return <TrendingDown size={20} aria-hidden="true" />;
      case 'savings':
        return <PiggyBank size={20} aria-hidden="true" />;
      default:
        return <DollarSign size={20} aria-hidden="true" />;
    }
  };

  const displayValue = isPercentage
    ? `${amount}%`
    : typeof amount === 'number'
    ? formatCurrency(amount)
    : amount;

  return (
    <Card
      id={id || `stat-card-${variant}`}
      $variant={variant}
      data-testid={`stat-card-${variant}`}
      role="region"
      aria-label={`${title}: ${displayValue}`}
    >
      <TopRow>
        <CardTitle>{title}</CardTitle>
        <IconWrapper $variant={variant}>{getIcon()}</IconWrapper>
      </TopRow>
      <Amount data-testid={`stat-amount-${variant}`}>{displayValue}</Amount>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Card>
  );
};
