const STORAGE_KEYS = {
  TRANSACTIONS: 'fintrack_transactions_v1',
  BUDGET: 'fintrack_monthly_budget_v1',
  THEME: 'fintrack_theme_preference_v1',
};

export const INITIAL_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Cloud Infrastructure (AWS)',
    amount: 145.5,
    type: 'expense',
    category: 'Software',
    date: '2026-10-18',
    notes: 'Monthly EC2 & RDS billing',
  },
  {
    id: 'tx-2',
    title: 'Client Retainer Payment',
    amount: 3200.0,
    type: 'income',
    category: 'Consulting',
    date: '2026-10-15',
    notes: 'Q4 UI/UX contract installment',
  },
  {
    id: 'tx-3',
    title: 'Coworking Space Membership',
    amount: 350.0,
    type: 'expense',
    category: 'Office',
    date: '2026-10-12',
    notes: 'Desk pass & meeting room access',
  },
  {
    id: 'tx-4',
    title: 'Figma Organization License',
    amount: 90.0,
    type: 'expense',
    category: 'Software',
    date: '2026-10-10',
    notes: 'Annual tier for team',
  },
  {
    id: 'tx-5',
    title: 'Digital Product Sales (Gumroad)',
    amount: 840.25,
    type: 'income',
    category: 'Passive Income',
    date: '2026-10-08',
    notes: 'Icon pack & dashboard templates',
  },
];

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
