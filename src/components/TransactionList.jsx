import React, { useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { Search, Filter, Inbox, X } from 'lucide-react';
import { TransactionItem } from './TransactionItem';
import { filterAndSortTransactions } from '../utils/finance';

const Container = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: 24px;
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  backdrop-filter: blur(12px);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CountBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radii.full};
`;

const FilterControls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 38px 10px 40px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.9rem;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primaryLight};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const ClearSearchBtn = styled.button`
  position: absolute;
  right: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const TypeFilters = styled.div`
  display: inline-flex;
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const TypeFilterBtn = styled.button`
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 0.85rem;
  font-weight: 600;
  transition: all ${({ theme }) => theme.transitions.fast};

  ${({ $active, theme }) =>
    $active
      ? css`
          background: ${theme.colors.primary};
          color: #ffffff;
          box-shadow: ${theme.colors.shadowSm};
        `
      : css`
          color: ${theme.colors.textSecondary};
          &:hover {
            color: ${theme.colors.text};
          }
        `}
`;

const DropdownsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceSubtle};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px dashed ${({ theme }) => theme.colors.border};
`;

const EmptyIconBox = styled.div`
  margin-bottom: 12px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 4px;
`;

export const TransactionList = ({ transactions = [], onDeleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  // Derive unique categories from existing transactions
  const uniqueCategories = useMemo(() => {
    const set = new Set();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    let sortField = 'date';
    let sortOrder = 'desc';

    if (sortBy === 'date-asc') {
      sortField = 'date';
      sortOrder = 'asc';
    } else if (sortBy === 'amount-desc') {
      sortField = 'amount';
      sortOrder = 'desc';
    } else if (sortBy === 'amount-asc') {
      sortField = 'amount';
      sortOrder = 'asc';
    } else if (sortBy === 'title-asc') {
      sortField = 'title';
      sortOrder = 'asc';
    }

    return filterAndSortTransactions(transactions, {
      type: typeFilter,
      category: categoryFilter,
      searchTerm,
      sortBy: sortField,
      sortOrder,
    });
  }, [transactions, typeFilter, categoryFilter, searchTerm, sortBy]);

  return (
    <Container id="transaction-list-section" data-testid="transaction-list-card">
      <HeaderRow>
        <Title>
          <Filter size={20} color="#6366f1" aria-hidden="true" />
          <span>Ledger & History</span>
          <CountBadge data-testid="tx-count-badge">
            {filteredTransactions.length} of {transactions.length}
          </CountBadge>
        </Title>
      </HeaderRow>

      <FilterControls>
        <SearchWrapper>
          <SearchIcon>
            <Search size={18} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by description, category, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search transactions"
            data-testid="search-input"
          />
          {searchTerm && (
            <ClearSearchBtn
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
              data-testid="clear-search-btn"
            >
              <X size={16} />
            </ClearSearchBtn>
          )}
        </SearchWrapper>

        <FilterRow>
          <TypeFilters role="group" aria-label="Filter transactions by type">
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              data-testid="filter-type-all"
            >
              All
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'income'}
              onClick={() => setTypeFilter('income')}
              data-testid="filter-type-income"
            >
              Income
            </TypeFilterBtn>
            <TypeFilterBtn
              type="button"
              $active={typeFilter === 'expense'}
              onClick={() => setTypeFilter('expense')}
              data-testid="filter-type-expense"
            >
              Expense
            </TypeFilterBtn>
          </TypeFilters>

          <DropdownsGroup>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              data-testid="filter-category-select"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>

            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort transactions"
              data-testid="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Amount: High to Low</option>
              <option value="amount-asc">Amount: Low to High</option>
              <option value="title-asc">Title: A to Z</option>
            </Select>
          </DropdownsGroup>
        </FilterRow>
      </FilterControls>

      <ListWrapper data-testid="transactions-wrapper">
        {filteredTransactions.length === 0 ? (
          <EmptyState data-testid="empty-transactions-state">
            <EmptyIconBox>
              <Inbox size={42} />
            </EmptyIconBox>
            <EmptyTitle>No Transactions Found</EmptyTitle>
            <p>
              {transactions.length === 0
                ? 'Your transaction ledger is empty. Start by logging your first transaction!'
                : 'No transactions match the selected filter or search criteria.'}
            </p>
          </EmptyState>
        ) : (
          filteredTransactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </ListWrapper>
    </Container>
  );
};
