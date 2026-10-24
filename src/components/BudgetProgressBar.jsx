import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Target, Edit2, Check, AlertTriangle } from 'lucide-react';
import { formatCurrency, calculateBudgetStatus } from '../utils/finance';

const Card = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
  margin-bottom: 24px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
`;

const TitleBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`;

const StatusBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radii.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ $status, theme }) => {
    switch ($status) {
      case 'critical':
        return css`
          background: ${theme.colors.expenseLight};
          color: ${theme.colors.expense};
          border: 1px solid rgba(244, 63, 94, 0.3);
        `;
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      default:
        return css`
          background: ${theme.colors.incomeLight};
          color: ${theme.colors.income};
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
    }
  }}
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 12px;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-radius: ${({ theme }) => theme.radii.full};
  overflow: hidden;
  margin-bottom: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radii.full};
  width: ${({ $percentage }) => Math.min(100, Math.max(0, $percentage))}%;
  transition: width ${({ theme }) => theme.transitions.normal}, background-color ${({ theme }) => theme.transitions.normal};

  ${({ $status }) => {
    switch ($status) {
      case 'critical':
        return css`background: linear-gradient(90deg, #f43f5e, #e11d48);`;
      case 'warning':
        return css`background: linear-gradient(90deg, #f59e0b, #d97706);`;
      default:
        return css`background: linear-gradient(90deg, #10b981, #059669);`;
    }
  }}
`;

const DetailsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
  gap: 8px;
`;

const BoldSpan = styled.span`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontMono};
`;

const EditButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primaryLight};
  }
`;

const InlineForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BudgetInput = styled.input`
  width: 110px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.typography.fontMono};
  font-size: 0.85rem;

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

const SaveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #ffffff;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const BudgetProgressBar = ({
  totalExpense = 0,
  budgetLimit = 2500,
  onUpdateBudget,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(String(budgetLimit));

  const { status, percentage, remaining } = calculateBudgetStatus(totalExpense, budgetLimit);

  const handleSave = (e) => {
    e.preventDefault();
    const parsed = parseFloat(newBudget);
    if (!isNaN(parsed) && parsed > 0 && onUpdateBudget) {
      onUpdateBudget(parsed);
      setIsEditing(false);
    }
  };

  const getStatusLabel = () => {
    if (status === 'critical') return 'Over Budget';
    if (status === 'warning') return '80% Warning';
    return 'Healthy Budget';
  };

  return (
    <Card id="budget-progress-section" data-testid="budget-progress-card">
      <HeaderRow>
        <TitleBox>
          <Target size={20} color="#6366f1" aria-hidden="true" />
          <Title>Monthly Spending Budget</Title>
          <StatusBadge $status={status} data-testid="budget-status-badge">
            {status === 'critical' && <AlertTriangle size={12} style={{ marginRight: 4 }} />}
            {getStatusLabel()}
          </StatusBadge>
        </TitleBox>

        <div>
          {isEditing ? (
            <InlineForm onSubmit={handleSave} data-testid="budget-edit-form">
              <label htmlFor="budget-input-field" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
                New Budget Limit
              </label>
              <BudgetInput
                id="budget-input-field"
                type="number"
                min="1"
                step="50"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                autoFocus
                aria-label="New budget amount"
                data-testid="budget-input-field"
              />
              <SaveButton type="submit" onClick={handleSave} aria-label="Save budget" data-testid="save-budget-btn">
                <Check size={16} />
              </SaveButton>
            </InlineForm>
          ) : (
            <EditButton
              onClick={() => {
                setNewBudget(String(budgetLimit));
                setIsEditing(true);
              }}
              aria-label="Edit monthly budget"
              data-testid="edit-budget-btn"
            >
              <Edit2 size={14} />
              <span>Adjust Target</span>
            </EditButton>
          )}
        </div>
      </HeaderRow>

      <ProgressTrack
        role="progressbar"
        aria-valuenow={Math.min(100, percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Monthly budget progress: ${percentage}% spent of ${formatCurrency(budgetLimit)}`}
        data-testid="budget-progress-bar"
      >
        <ProgressFill $percentage={percentage} $status={status} />
      </ProgressTrack>

      <DetailsRow>
        <div>
          <span>Spent: </span>
          <BoldSpan data-testid="budget-spent-text">{formatCurrency(totalExpense)}</BoldSpan>
          <span> of </span>
          <BoldSpan data-testid="budget-limit-text">{formatCurrency(budgetLimit)}</BoldSpan>
          <span> ({percentage}%)</span>
        </div>
        <div>
          <span>Remaining: </span>
          <BoldSpan
            data-testid="budget-remaining-text"
            style={{ color: status === 'critical' ? '#f43f5e' : undefined }}
          >
            {formatCurrency(remaining)}
          </BoldSpan>
        </div>
      </DetailsRow>
    </Card>
  );
};
