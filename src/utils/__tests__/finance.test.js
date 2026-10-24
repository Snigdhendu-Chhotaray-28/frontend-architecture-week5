import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  parseAmount,
  calculateTotals,
  calculateBudgetStatus,
  calculateCategoryBreakdown,
  filterAndSortTransactions,
  validateTransaction,
} from '../finance';

describe('Financial Calculation & Formatting Utilities', () => {
  describe('formatCurrency', () => {
    it('should format standard positive numbers as USD currency', () => {
      expect(formatCurrency(1250.5)).toBe('$1,250.50');
      expect(formatCurrency(100)).toBe('$100.00');
    });

    it('should format numeric string input properly', () => {
      expect(formatCurrency('45.99')).toBe('$45.99');
    });

    it('should format negative amounts correctly', () => {
      expect(formatCurrency(-500)).toMatch(/-\$500\.00|\(\$500\.00\)/);
    });

    it('should return fallback "$0.00" on null, undefined, or NaN inputs', () => {
      expect(formatCurrency(null)).toBe('$0.00');
      expect(formatCurrency(undefined)).toBe('$0.00');
      expect(formatCurrency(NaN)).toBe('$0.00');
      expect(formatCurrency('invalid-number')).toBe('$0.00');
    });

    it('should handle custom locales and currencies if provided', () => {
      const formattedEUR = formatCurrency(100, 'EUR', 'de-DE');
      expect(formattedEUR).toContain('100');
    });
  });

  describe('parseAmount', () => {
    it('should parse valid string amounts with currency symbols and commas', () => {
      expect(parseAmount('$1,234.56')).toBe(1234.56);
      expect(parseAmount('  99.90 ')).toBe(99.9);
    });

    it('should pass through numeric values unchanged', () => {
      expect(parseAmount(450.75)).toBe(450.75);
    });

    it('should return 0 on invalid or non-string inputs', () => {
      expect(parseAmount(null)).toBe(0);
      expect(parseAmount(undefined)).toBe(0);
      expect(parseAmount('abc')).toBe(0);
      expect(parseAmount('')).toBe(0);
      expect(parseAmount(NaN)).toBe(0);
    });
  });

  describe('calculateTotals', () => {
    it('should calculate total income, expenses, and net balance correctly', () => {
      const mockTransactions = [
        { amount: 1000, type: 'income' },
        { amount: 500, type: 'income' },
        { amount: 300, type: 'expense' },
        { amount: 200, type: 'expense' },
      ];

      const result = calculateTotals(mockTransactions);
      expect(result.totalIncome).toBe(1500);
      expect(result.totalExpense).toBe(500);
      expect(result.netBalance).toBe(1000);
      // Savings rate: ((1500 - 500) / 1500) * 100 = 66.67% -> rounded to 67%
      expect(result.savingsRate).toBe(67);
    });

    it('should avoid floating-point arithmetic errors with integer cents calculation', () => {
      // Classic JS floating point bug: 0.1 + 0.2 === 0.30000000000000004
      const mockTransactions = [
        { amount: 0.1, type: 'income' },
        { amount: 0.2, type: 'income' },
      ];
      const result = calculateTotals(mockTransactions);
      expect(result.totalIncome).toBe(0.3);
      expect(result.netBalance).toBe(0.3);
    });

    it('should return zeroes when transactions list is empty or invalid', () => {
      const emptyResult = calculateTotals([]);
      expect(emptyResult).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        savingsRate: 0,
      });

      const nullResult = calculateTotals(null);
      expect(nullResult).toEqual({
        totalIncome: 0,
        totalExpense: 0,
        netBalance: 0,
        savingsRate: 0,
      });
    });

    it('should handle zero income with expenses without dividing by zero', () => {
      const mockTransactions = [{ amount: 450, type: 'expense' }];
      const result = calculateTotals(mockTransactions);
      expect(result.totalIncome).toBe(0);
      expect(result.totalExpense).toBe(450);
      expect(result.netBalance).toBe(-450);
      expect(result.savingsRate).toBe(0);
    });
  });

  describe('calculateBudgetStatus', () => {
    it('should return safe status when expenses are well under budget', () => {
      const status = calculateBudgetStatus(500, 2000);
      expect(status.status).toBe('safe');
      expect(status.percentage).toBe(25);
      expect(status.remaining).toBe(1500);
    });

    it('should return warning status when expenses reach or exceed 80%', () => {
      const status = calculateBudgetStatus(800, 1000);
      expect(status.status).toBe('warning');
      expect(status.percentage).toBe(80);
      expect(status.remaining).toBe(200);
    });

    it('should return critical status when expenses hit or exceed 100%', () => {
      const status = calculateBudgetStatus(1200, 1000);
      expect(status.status).toBe('critical');
      expect(status.percentage).toBe(120);
      expect(status.remaining).toBe(0);
    });

    it('should return unbudgeted status when budget limit is 0 or negative', () => {
      const status = calculateBudgetStatus(500, 0);
      expect(status.status).toBe('unbudgeted');
      expect(status.percentage).toBe(0);
      expect(status.remaining).toBe(0);
    });
  });

  describe('calculateCategoryBreakdown', () => {
    it('should correctly aggregate expenses by category in descending order of spending', () => {
      const mockTransactions = [
        { amount: 100, type: 'expense', category: 'Software' },
        { amount: 300, type: 'expense', category: 'Office' },
        { amount: 100, type: 'expense', category: 'Software' },
        { amount: 2000, type: 'income', category: 'Salary' }, // Income should be ignored
      ];

      const breakdown = calculateCategoryBreakdown(mockTransactions);
      expect(breakdown).toHaveLength(2);
      expect(breakdown[0].category).toBe('Office');
      expect(breakdown[0].total).toBe(300);
      expect(breakdown[0].percentage).toBe(60); // 300 / 500 = 60%
      expect(breakdown[0].count).toBe(1);

      expect(breakdown[1].category).toBe('Software');
      expect(breakdown[1].total).toBe(200);
      expect(breakdown[1].percentage).toBe(40); // 200 / 500 = 40%
      expect(breakdown[1].count).toBe(2);
    });

    it('should return an empty array if there are no expense transactions', () => {
      const mockTransactions = [{ amount: 1000, type: 'income', category: 'Salary' }];
      expect(calculateCategoryBreakdown(mockTransactions)).toEqual([]);
      expect(calculateCategoryBreakdown([])).toEqual([]);
      expect(calculateCategoryBreakdown(null)).toEqual([]);
    });
  });

  describe('filterAndSortTransactions', () => {
    const sampleList = [
      { id: '1', title: 'AWS Cloud', amount: 100, type: 'expense', category: 'Software', date: '2026-10-10' },
      { id: '2', title: 'Client Payment', amount: 2500, type: 'income', category: 'Consulting', date: '2026-10-15' },
      { id: '3', title: 'Figma Sub', amount: 45, type: 'expense', category: 'Software', date: '2026-10-12' },
    ];

    it('should filter by transaction type', () => {
      const expenses = filterAndSortTransactions(sampleList, { type: 'expense' });
      expect(expenses).toHaveLength(2);
      expect(expenses.every((t) => t.type === 'expense')).toBe(true);

      const income = filterAndSortTransactions(sampleList, { type: 'income' });
      expect(income).toHaveLength(1);
      expect(income[0].title).toBe('Client Payment');
    });

    it('should filter by category', () => {
      const software = filterAndSortTransactions(sampleList, { category: 'Software' });
      expect(software).toHaveLength(2);
    });

    it('should filter by search term matching title', () => {
      const searchResult = filterAndSortTransactions(sampleList, { searchTerm: 'AWS' });
      expect(searchResult).toHaveLength(1);
      expect(searchResult[0].title).toBe('AWS Cloud');
    });

    it('should sort by amount ascending and descending', () => {
      const asc = filterAndSortTransactions(sampleList, { sortBy: 'amount', sortOrder: 'asc' });
      expect(asc[0].amount).toBe(45);
      expect(asc[2].amount).toBe(2500);

      const desc = filterAndSortTransactions(sampleList, { sortBy: 'amount', sortOrder: 'desc' });
      expect(desc[0].amount).toBe(2500);
      expect(desc[2].amount).toBe(45);
    });

    it('should sort by title alphabetically', () => {
      const sortedByTitle = filterAndSortTransactions(sampleList, { sortBy: 'title', sortOrder: 'asc' });
      expect(sortedByTitle[0].title).toBe('AWS Cloud');
      expect(sortedByTitle[1].title).toBe('Client Payment');
      expect(sortedByTitle[2].title).toBe('Figma Sub');
    });
  });

  describe('validateTransaction', () => {
    const validData = {
      title: 'Valid Expense',
      amount: 150,
      type: 'expense',
      category: 'Software',
      date: '2026-10-20',
    };

    it('should validate a correct transaction object', () => {
      const result = validateTransaction(validData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('should reject missing or too short title', () => {
      expect(validateTransaction({ ...validData, title: '' }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, title: 'ab' }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, title: 'a'.repeat(65) }).isValid).toBe(false);
    });

    it('should reject non-positive or missing amount', () => {
      expect(validateTransaction({ ...validData, amount: 0 }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, amount: -50 }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, amount: '' }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, amount: 15000000 }).isValid).toBe(false);
    });

    it('should reject invalid transaction type', () => {
      expect(validateTransaction({ ...validData, type: 'unknown' }).isValid).toBe(false);
    });

    it('should reject missing category or invalid date', () => {
      expect(validateTransaction({ ...validData, category: '' }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, date: 'not-a-date' }).isValid).toBe(false);
      expect(validateTransaction({ ...validData, date: '' }).isValid).toBe(false);
    });

    it('should reject non-object input payload', () => {
      const result = validateTransaction(null);
      expect(result.isValid).toBe(false);
      expect(result.errors.general).toBe('Transaction data must be an object');
    });
  });

  describe('formatCurrency fallback', () => {
    it('should handle Intl.NumberFormat fallback on formatting errors', () => {
      const originalIntl = Intl.NumberFormat;
      Intl.NumberFormat = vi.fn().mockImplementation(() => {
        throw new Error('Unsupported locale');
      });

      const formatted = formatCurrency(123.45);
      expect(formatted).toBe('$123.45');

      Intl.NumberFormat = originalIntl;
    });
  });
});
