import { describe, it, expect, beforeEach, vi } from 'vitest';
import { StorageService, INITIAL_TRANSACTIONS, INITIAL_BUDGET } from '../storage';

describe('StorageService Persistence Layer', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('Transactions Persistence', () => {
    it('should return default initial transactions when localStorage is empty', () => {
      const loaded = StorageService.loadTransactions();
      expect(loaded).toEqual(INITIAL_TRANSACTIONS);
    });

    it('should save and load valid transactions correctly', () => {
      const customTransactions = [
        { id: 'tx-99', title: 'Serverless Edge Node', amount: 49.99, type: 'expense', category: 'Software', date: '2026-10-20' },
      ];

      const saveStatus = StorageService.saveTransactions(customTransactions);
      expect(saveStatus).toBe(true);

      const loaded = StorageService.loadTransactions();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].title).toBe('Serverless Edge Node');
    });

    it('should recover gracefully and return initial transactions if stored JSON is corrupted', () => {
      localStorage.setItem('fintrack_transactions_v1', '{malformed:json:::');
      const loaded = StorageService.loadTransactions();
      expect(loaded).toEqual(INITIAL_TRANSACTIONS);
    });

    it('should return false if invalid data structure is passed to saveTransactions', () => {
      const saveStatus = StorageService.saveTransactions('invalid-not-an-array');
      expect(saveStatus).toBe(false);
    });
  });

  describe('Budget Persistence', () => {
    it('should load default initial budget when nothing is stored', () => {
      expect(StorageService.loadBudget()).toBe(INITIAL_BUDGET);
    });

    it('should save and load custom budget amount', () => {
      const saved = StorageService.saveBudget(4500);
      expect(saved).toBe(true);
      expect(StorageService.loadBudget()).toBe(4500);
    });

    it('should reject invalid budget values', () => {
      expect(StorageService.saveBudget(-100)).toBe(false);
      expect(StorageService.saveBudget('not-a-number')).toBe(false);
    });
  });

  describe('Theme Preference Persistence', () => {
    it('should default to "dark" theme if none stored', () => {
      expect(StorageService.loadTheme()).toBe('dark');
    });

    it('should save and retrieve light theme preference', () => {
      StorageService.saveTheme('light');
      expect(StorageService.loadTheme()).toBe('light');
    });

    it('should return false if localStorage.setItem throws in saveTheme', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
        throw new Error('QuotaExceeded');
      });
      expect(StorageService.saveTheme('light')).toBe(false);
    });
  });

  describe('clearAll', () => {
    it('should clear all fintrack keys from storage', () => {
      StorageService.saveBudget(3000);
      StorageService.saveTheme('light');
      expect(StorageService.clearAll()).toBe(true);
      expect(StorageService.loadBudget()).toBe(INITIAL_BUDGET);
    });

    it('should return false if localStorage.removeItem throws in clearAll', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementationOnce(() => {
        throw new Error('SecurityError');
      });
      expect(StorageService.clearAll()).toBe(false);
    });
  });
});
