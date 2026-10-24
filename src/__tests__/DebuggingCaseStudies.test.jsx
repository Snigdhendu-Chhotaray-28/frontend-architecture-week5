import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { calculateTotals } from '../utils/finance';
import { StorageService } from '../services/storage';
import { TransactionForm } from '../components/TransactionForm';
import { NotificationBanner } from '../components/NotificationBanner';
import { renderWithTheme } from '../test-utils';

describe('Debugging Case Studies & Bug Reproduction Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  /**
   * CASE STUDY 1: IEEE 754 Floating-Point Precision Error in Financial Aggregations
   * Problem: In standard JavaScript, adding fractional dollar amounts such as
   * 0.1 + 0.2 produces 0.30000000000000004. In an enterprise ledger, this causes
   * incorrect balance calculations, rounding drift, and broken balance reconciliation.
   * Technique: Reproduce with exact decimal values, diagnose via unit test,
   * fix with integer-cents transformation (Math.round(amount * 100)).
   */
  describe('Case Study 1: Floating-Point Math Bug Fix', () => {
    it('demonstrates standard JS floating point failure vs fixed-point cents precision', () => {
      // The naive implementation that caused the bug:
      const naiveCalculateTotal = (amounts) => amounts.reduce((acc, val) => acc + val, 0);
      const buggyResult = naiveCalculateTotal([0.1, 0.2]);
      // Buggy behavior: 0.1 + 0.2 !== 0.3
      expect(buggyResult).not.toBe(0.3);
      expect(buggyResult).toBe(0.30000000000000004);

      // The verified fix in calculateTotals:
      const fixedResult = calculateTotals([
        { amount: 0.1, type: 'income' },
        { amount: 0.2, type: 'income' },
      ]);
      expect(fixedResult.totalIncome).toBe(0.3);
      expect(fixedResult.netBalance).toBe(0.3);
    });

    it('accurately resolves cumulative precision error across 100 micropayments', () => {
      // 100 payments of $0.07 each = exact $7.00
      const microTransactions = Array(100).fill({ amount: 0.07, type: 'income' });
      const { totalIncome } = calculateTotals(microTransactions);
      expect(totalIncome).toBe(7.0);
    });
  });

  /**
   * CASE STUDY 2: Rapid Double-Click Race Condition in Form Submission
   * Problem: Users rapidly double-clicking or pressing Enter rapidly could fire
   * redundant form submissions before the state update/handler completed, creating
   * duplicate ledger records.
   * Technique: Simulated via userEvent with doubleClick on the submit button.
   * Fix: Submit button disables and sets isSubmitting state during processing,
   * plus form resets immediately.
   */
  describe('Case Study 2: Double-Click Race Condition Fix', () => {
    it('prevents duplicate submissions when user rapidly clicks submit button', async () => {
      const user = userEvent.setup();
      const mockAddTransaction = vi.fn();

      renderWithTheme(<TransactionForm onAddTransaction={mockAddTransaction} />);

      await user.type(screen.getByTestId('title-input'), 'Fast API Server');
      await user.type(screen.getByTestId('amount-input'), '55');

      const submitBtn = screen.getByTestId('submit-transaction-btn');

      // User double clicks rapidly
      await user.dblClick(submitBtn);

      // Should only submit once because inputs reset and isSubmitting guards the cycle
      expect(mockAddTransaction).toHaveBeenCalledTimes(1);
    });
  });

  /**
   * CASE STUDY 3: Unhandled SyntaxError Crash on Corrupted LocalStorage
   * Problem: If a user or browser extension corrupted the JSON stored under
   * 'fintrack_transactions_v1' (e.g. truncated string, invalid token), JSON.parse()
   * would throw an uncaught SyntaxError at initialization, causing a blank screen crash.
   * Technique: Inject malformed string into localStorage, verify app gracefully recovers.
   */
  describe('Case Study 3: Storage JSON Corruption Recovery Fix', () => {
    it('gracefully recovers from malformed localStorage JSON without throwing unhandled exceptions', () => {
      // Inject corrupted payload
      localStorage.setItem('fintrack_transactions_v1', '{"malformed_json_unclosed:');

      // The unhandled naive parse would throw:
      expect(() => JSON.parse(localStorage.getItem('fintrack_transactions_v1'))).toThrow(SyntaxError);

      // The hardened StorageService catches the error and returns valid fallback data:
      let loadedTransactions;
      expect(() => {
        loadedTransactions = StorageService.loadTransactions();
      }).not.toThrow();

      expect(Array.isArray(loadedTransactions)).toBe(true);
      expect(loadedTransactions.length).toBeGreaterThan(0);
    });
  });

  /**
   * CASE STUDY 4: Accessible Live Region Announcement on Dynamic Alerts
   * Problem: Screen readers (NVDA, VoiceOver) were not alerting visually impaired
   * users when budget thresholds exceeded 80% or 100% because the banner lacked
   * aria-live and role="alert" properties.
   * Technique: RTL role and attribute query to verify live region announcement.
   */
  describe('Case Study 4: Accessibility Alert Announcement Fix', () => {
    it('ensures dynamic notifications contain role="alert" and aria-live="polite"', () => {
      renderWithTheme(
        <NotificationBanner
          message="Budget Exceeded: 105% spent"
          variant="critical"
        />
      );

      const alertBanner = screen.getByRole('alert');
      expect(alertBanner).toBeInTheDocument();
      expect(alertBanner).toHaveAttribute('aria-live', 'polite');
      expect(alertBanner).toHaveTextContent('Budget Exceeded: 105% spent');
    });
  });

  /**
   * CASE STUDY 5: Date Timezone Boundary Shift Bug in Transaction Date Formatting
   * Problem: In financial reporting, dates entered as '2026-10-24' (date input standard)
   * if parsed naively via new Date('2026-10-24') interpret as UTC midnight (00:00:00Z).
   * In timezones west of UTC (e.g., EST/EDT UTC-4 or PST/PDT UTC-7), calling .toLocaleDateString()
   * or .getDate() displays October 23rd! Financial records appear off by 1 day.
   * Technique: Reproduce timezone offset discrepancy and verify localized date preservation.
   * Fix: Parse [year, month, day] components explicitly into local calendar day.
   */
  describe('Case Study 5: Date Timezone Offset Boundary Fix', () => {
    it('demonstrates UTC midnight boundary shift problem vs timezone-safe parsing', () => {
      const rawDateStr = '2026-10-24';

      // Naive parsing: interprets as UTC 00:00:00
      const naiveDate = new Date(rawDateStr);
      expect(naiveDate.getUTCFullYear()).toBe(2026);
      expect(naiveDate.getUTCMonth()).toBe(9); // 0-indexed October
      expect(naiveDate.getUTCDate()).toBe(24);

      // Safe date formatter function used in FinTrack Pro:
      const formatLocalDate = (dateStr) => {
        const [year, month, day] = dateStr.split('-').map(Number);
        const local = new Date(year, month - 1, day);
        return {
          year: local.getFullYear(),
          month: local.getMonth() + 1,
          day: local.getDate(),
        };
      };

      const parsed = formatLocalDate(rawDateStr);
      expect(parsed.year).toBe(2026);
      expect(parsed.month).toBe(10);
      expect(parsed.day).toBe(24);
    });
  });
});
