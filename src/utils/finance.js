/**
 * Formats a numeric amount to localized currency string.
 * @param {number|string} amount
 * @param {string} currency - Default 'USD'
 * @param {string} locale - Default 'en-US'
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num === null || num === undefined || isNaN(num)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    // Fallback if locale or currency is unsupported
    return `$${num.toFixed(2)}`;
  }
};

/**
 * Parses numeric input value safely. Returns NaN if completely invalid.
 * @param {string|number} value
 * @returns {number}
 */
export const parseAmount = (value) => {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value || typeof value !== 'string') return 0;
  // Strip currency symbols and whitespace
  const sanitized = value.replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Calculates totals with integer cents arithmetic to avoid floating-point drift.
 * @param {Array<{ amount: number, type: 'income'|'expense' }>} transactions
 * @returns {{ totalIncome: number, totalExpense: number, netBalance: number, savingsRate: number }}
 */
export const calculateTotals = (transactions = []) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return {
      totalIncome: 0,
      totalExpense: 0,
      netBalance: 0,
      savingsRate: 0,
    };
  }

  let incomeCents = 0;
  let expenseCents = 0;

  for (const t of transactions) {
    const amount = Number(t.amount) || 0;
    const cents = Math.round(amount * 100);

    if (t.type === 'income') {
      incomeCents += cents;
    } else if (t.type === 'expense') {
      expenseCents += cents;
    }
  }

  const totalIncome = incomeCents / 100;
  const totalExpense = expenseCents / 100;
  const netBalance = (incomeCents - expenseCents) / 100;

  // Savings rate = ((income - expense) / income) * 100
  let savingsRate = 0;
  if (totalIncome > 0) {
    savingsRate = Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100));
  }

  return {
    totalIncome,
    totalExpense,
    netBalance,
    savingsRate,
  };
};

/**
 * Calculates budget consumption and alert status.
 * @param {number} totalExpense
 * @param {number} budgetLimit
 * @returns {{ status: 'safe'|'warning'|'critical'|'unbudgeted', percentage: number, remaining: number }}
 */
export const calculateBudgetStatus = (totalExpense, budgetLimit) => {
  const expense = Math.max(0, Number(totalExpense) || 0);
  const limit = Math.max(0, Number(budgetLimit) || 0);

  if (limit <= 0) {
    return {
      status: 'unbudgeted',
      percentage: 0,
      remaining: 0,
    };
  }

  const percentage = Math.round((expense / limit) * 100);
  const remaining = Math.max(0, Math.round((limit - expense) * 100) / 100);

  let status = 'safe';
  if (percentage >= 100) {
    status = 'critical';
  } else if (percentage >= 80) {
    status = 'warning';
  }

  return {
    status,
    percentage,
    remaining,
  };
};

/**
 * Aggregates expenses by category with percentages and total spending.
 * @param {Array<{ amount: number, type: string, category: string }>} transactions
 * @returns {Array<{ category: string, total: number, percentage: number, count: number }>}
 */
export const calculateCategoryBreakdown = (transactions = []) => {
  if (!Array.isArray(transactions)) return [];

  const expenses = transactions.filter((t) => t.type === 'expense');
  if (expenses.length === 0) return [];

  const categoryMap = {};
  let totalExpenseCents = 0;

  expenses.forEach((t) => {
    const cat = t.category || 'Uncategorized';
    const cents = Math.round((Number(t.amount) || 0) * 100);
    totalExpenseCents += cents;

    if (!categoryMap[cat]) {
      categoryMap[cat] = { cents: 0, count: 0 };
    }
    categoryMap[cat].cents += cents;
    categoryMap[cat].count += 1;
  });

  if (totalExpenseCents === 0) return [];

  return Object.keys(categoryMap).map((cat) => {
    const cents = categoryMap[cat].cents;
    const total = cents / 100;
    const percentage = Math.round((cents / totalExpenseCents) * 100);
    return {
      category: cat,
      total,
      percentage,
      count: categoryMap[cat].count,
    };
  }).sort((a, b) => b.total - a.total);
};

/**
 * Filters and sorts transaction list.
 * @param {Array} transactions
 * @param {Object} options
 * @returns {Array}
 */
export const filterAndSortTransactions = (
  transactions = [],
  { type = 'all', category = 'all', searchTerm = '', sortBy = 'date', sortOrder = 'desc' } = {}
) => {
  if (!Array.isArray(transactions)) return [];

  let result = [...transactions];

  // Filter by Type
  if (type !== 'all') {
    result = result.filter((t) => t.type === type);
  }

  // Filter by Category
  if (category !== 'all') {
    result = result.filter((t) => (t.category || '').toLowerCase() === category.toLowerCase());
  }

  // Filter by Search Query
  if (searchTerm && searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    result = result.filter(
      (t) =>
        (t.title && t.title.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term)) ||
        (t.notes && t.notes.toLowerCase().includes(term))
    );
  }

  // Sort
  result.sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'amount') {
      comparison = (Number(a.amount) || 0) - (Number(b.amount) || 0);
    } else if (sortBy === 'title') {
      comparison = (a.title || '').localeCompare(b.title || '');
    } else {
      // Default 'date'
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  return result;
};

/**
 * Validates a transaction object before submission.
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export const validateTransaction = (data) => {
  const errors = {};

  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: { general: 'Transaction data must be an object' } };
  }

  // Title validation
  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  } else if (data.title.trim().length > 60) {
    errors.title = 'Title cannot exceed 60 characters';
  }

  // Amount validation
  const amount = Number(data.amount);
  if (data.amount === '' || data.amount === null || data.amount === undefined || isNaN(amount)) {
    errors.amount = 'Valid amount is required';
  } else if (amount <= 0) {
    errors.amount = 'Amount must be greater than zero';
  } else if (amount > 10000000) {
    errors.amount = 'Amount cannot exceed $10,000,000';
  }

  // Type validation
  if (!data.type || !['income', 'expense'].includes(data.type)) {
    errors.type = "Type must be either 'income' or 'expense'";
  }

  // Category validation
  if (!data.category || typeof data.category !== 'string' || data.category.trim() === '') {
    errors.category = 'Category selection is required';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      errors.date = 'Invalid date format';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
