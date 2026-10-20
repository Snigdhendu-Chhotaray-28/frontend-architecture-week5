import React, { useState, useEffect, useMemo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { BudgetProgressBar } from './components/BudgetProgressBar';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { NotificationBanner } from './components/NotificationBanner';
import { StorageService } from './services/storage';
import { calculateTotals, calculateBudgetStatus } from './utils/finance';
import { RotateCcw } from 'lucide-react';

const AppWrapper = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px 60px 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 16px 40px 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 1fr;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const FooterBar = styled.footer`
  margin-top: 48px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-wrap: wrap;
  gap: 12px;
`;

const ResetDataBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.8rem;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.expense};
  }
`;

export const App = () => {
  const [themeMode, setThemeMode] = useState(() => StorageService.loadTheme());
  const [transactions, setTransactions] = useState(() => StorageService.loadTransactions());
  const [budgetLimit, setBudgetLimit] = useState(() => StorageService.loadBudget());
  const [notification, setNotification] = useState(null);

  // Sync state to localStorage on updates
  useEffect(() => {
    StorageService.saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    StorageService.saveBudget(budgetLimit);
  }, [budgetLimit]);

  useEffect(() => {
    StorageService.saveTheme(themeMode);
  }, [themeMode]);

  // Derived financial computations
  const totals = useMemo(() => calculateTotals(transactions), [transactions]);
  const budgetStatus = useMemo(
    () => calculateBudgetStatus(totals.totalExpense, budgetLimit),
    [totals.totalExpense, budgetLimit]
  );

  // Trigger alert banner if budget is exceeded or critical
  useEffect(() => {
    if (budgetStatus.status === 'critical') {
      setNotification({
        message: `Budget Alert: You have exceeded your monthly limit of $${budgetLimit.toLocaleString()} by $${(
          totals.totalExpense - budgetLimit
        ).toFixed(2)}!`,
        variant: 'critical',
      });
    } else if (budgetStatus.status === 'warning') {
      setNotification({
        message: `Caution: You have utilized ${budgetStatus.percentage}% of your monthly budget limit.`,
        variant: 'warning',
      });
    } else {
      setNotification(null);
    }
  }, [budgetStatus.status, budgetStatus.percentage, budgetLimit, totals.totalExpense]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleAddTransaction = (newTx) => {
    setTransactions((prev) => [newTx, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateBudget = (newLimit) => {
    setBudgetLimit(newLimit);
  };

  const handleResetData = () => {
    StorageService.clearAll();
    const fresh = StorageService.loadTransactions();
    setTransactions(fresh);
    setBudgetLimit(2500);
  };

  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyles />
      <AppWrapper id="fintrack-app-container">
        <Header currentTheme={themeMode} onToggleTheme={toggleTheme} />

        {notification && (
          <NotificationBanner
            message={notification.message}
            variant={notification.variant}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Top KPI Metrics Row */}
        <StatsGrid id="stats-overview-grid" data-testid="stats-overview-grid">
          <StatCard
            title="Total Inflow"
            amount={totals.totalIncome}
            variant="income"
            subtitle="Verified deposits & revenue"
          />
          <StatCard
            title="Total Outflow"
            amount={totals.totalExpense}
            variant="expense"
            subtitle="Operational & personal expenses"
          />
          <StatCard
            title="Net Liquidity"
            amount={totals.netBalance}
            variant="balance"
            subtitle={totals.netBalance >= 0 ? 'Positive financial margin' : 'Cash deficit warning'}
          />
          <StatCard
            title="Savings Rate"
            amount={totals.savingsRate}
            variant="savings"
            isPercentage
            subtitle="Retained income efficiency"
          />
        </StatsGrid>

        {/* Budget Progress Bar */}
        <BudgetProgressBar
          totalExpense={totals.totalExpense}
          budgetLimit={budgetLimit}
          onUpdateBudget={handleUpdateBudget}
        />

        {/* Two-Column Layout */}
        <MainGrid>
          <LeftColumn>
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <CategoryBreakdown transactions={transactions} />
          </LeftColumn>

          <RightColumn>
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </RightColumn>
        </MainGrid>

        <FooterBar>
          <span>FinTrack Pro v1.0.0 • Architecture & Testing Suite</span>
          <ResetDataBtn onClick={handleResetData} data-testid="reset-data-btn">
            <RotateCcw size={14} />
            Reset Initial Demo Dataset
          </ResetDataBtn>
        </FooterBar>
      </AppWrapper>
    </ThemeProvider>
  );
};

export default App;
