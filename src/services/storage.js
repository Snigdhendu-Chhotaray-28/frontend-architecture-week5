import initialTransactionsData from '../data/mockTransactions.json';

const STORAGE_KEYS = {
  TRANSACTIONS: 'fintrack_transactions_v1',
  BUDGET: 'fintrack_monthly_budget_v1',
  THEME: 'fintrack_theme_preference_v1',
};

export const INITIAL_TRANSACTIONS = initialTransactionsData;

export const INITIAL_BUDGET = 2500;

export const StorageService = {
  /**
   * Load transactions safely with fallback.
   * @returns {Array}
   */
  loadTransactions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (!data) return INITIAL_TRANSACTIONS;
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : INITIAL_TRANSACTIONS;
    } catch (err) {
      console.warn('StorageService: Failed to parse transactions, returning fallback.', err);
      return INITIAL_TRANSACTIONS;
    }
  },

  /**
   * Save transactions safely.
   * @param {Array} transactions
   * @returns {boolean}
   */
  saveTransactions(transactions) {
    try {
      if (!Array.isArray(transactions)) {
        throw new TypeError('Transactions payload must be an array');
      }
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      return true;
    } catch (err) {
      console.error('StorageService: Failed to save transactions to localStorage.', err);
      return false;
    }
  },

  /**
   * Load monthly budget limit.
   * @returns {number}
   */
  loadBudget() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
      if (!data) return INITIAL_BUDGET;
      const num = Number(data);
      return isNaN(num) || num <= 0 ? INITIAL_BUDGET : num;
    } catch (err) {
      console.warn('StorageService: Failed to load budget, returning default.', err);
      return INITIAL_BUDGET;
    }
  },

  /**
   * Save monthly budget limit.
   * @param {number} budget
   * @returns {boolean}
   */
  saveBudget(budget) {
    try {
      const num = Number(budget);
      if (isNaN(num) || num < 0) return false;
      localStorage.setItem(STORAGE_KEYS.BUDGET, String(num));
      return true;
    } catch (err) {
      console.error('StorageService: Failed to save budget to localStorage.', err);
      return false;
    }
  },

  /**
   * Load theme preference.
   * @returns {'dark'|'light'}
   */
  loadTheme() {
    try {
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      return theme === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  },

  /**
   * Save theme preference.
   * @param {'dark'|'light'} theme
   * @returns {boolean}
   */
  saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Clears all stored data (useful for resets and test isolation).
   */
  clearAll() {
    try {
      localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
      localStorage.removeItem(STORAGE_KEYS.BUDGET);
      localStorage.removeItem(STORAGE_KEYS.THEME);
      return true;
    } catch {
      return false;
    }
  },
};
