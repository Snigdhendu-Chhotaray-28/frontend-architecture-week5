# FinTrack Pro – Enterprise React Testing & Quality Assurance Suite

[![Tests](https://img.shields.io/badge/Tests-78%20Passed-success?style=for-the-badge&logo=vitest)](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)
[![Coverage](https://img.shields.io/badge/Coverage-96.8%25%20Lines-brightgreen?style=for-the-badge&logo=codecov)](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)
[![Styling](https://img.shields.io/badge/Styling-styled--components%20CSS--in--JS-informational?style=for-the-badge&logo=styled-components)](./src/styles/theme.js)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev)

> A modern personal & enterprise financial intelligence dashboard engineered with React 18, strict CSS-in-JS (`styled-components`), and an end-to-end quality assurance suite (Vitest + React Testing Library).

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```

### 3. Run Automated Tests
```bash
# Run all 78 tests across 11 test suites
npm test

# Run tests with real-time watch mode
npm run test:watch

# Generate full V8 test coverage table and HTML report
npm run test:coverage
```

### 4. Build for Production
```bash
npm run build
```

---

## 📊 Test Suite & Coverage Overview

- **Test Files:** 11 passed (11 total)
- **Tests:** 78 passed (78 total)
- **Statements Coverage:** 96.8%
- **Branch Coverage:** 93.83%
- **Lines Coverage:** 96.8%

| Test Suite File | Layer | Description | Tests | Status |
| :--- | :--- | :--- | :---: | :---: |
| [`src/utils/__tests__/finance.test.js`](./src/utils/__tests__/finance.test.js) | Unit | Financial calculations, currency formatting, validation | 28 | ✅ PASS |
| [`src/services/__tests__/storage.test.js`](./src/services/__tests__/storage.test.js) | Unit | LocalStorage service, corrupted JSON recovery | 10 | ✅ PASS |
| [`src/components/__tests__/StatCard.test.jsx`](./src/components/__tests__/StatCard.test.jsx) | Unit | KPI metric cards & ARIA labels | 3 | ✅ PASS |
| [`src/components/__tests__/BudgetProgressBar.test.jsx`](./src/components/__tests__/BudgetProgressBar.test.jsx) | Unit | Progress bar, 80%/100% warnings, inline edit | 4 | ✅ PASS |
| [`src/components/__tests__/TransactionItem.test.jsx`](./src/components/__tests__/TransactionItem.test.jsx) | Unit | Transaction row rendering & delete actions | 3 | ✅ PASS |
| [`src/components/__tests__/TransactionForm.test.jsx`](./src/components/__tests__/TransactionForm.test.jsx) | Unit | Controlled inputs, validation errors, submit | 4 | ✅ PASS |
| [`src/components/__tests__/CategoryBreakdown.test.jsx`](./src/components/__tests__/CategoryBreakdown.test.jsx) | Unit | Expense distribution and empty states | 2 | ✅ PASS |
| [`src/components/__tests__/NotificationBanner.test.jsx`](./src/components/__tests__/NotificationBanner.test.jsx) | Unit | Accessible live-region banners | 3 | ✅ PASS |
| [`src/__tests__/App.integration.test.jsx`](./src/__tests__/App.integration.test.jsx) | Integration | End-to-end component interaction flows | 8 | ✅ PASS |
| [`src/__tests__/CrossBrowserEmulation.test.jsx`](./src/__tests__/CrossBrowserEmulation.test.jsx) | Emulation | Mobile (375px), Tablet (768px), Desktop (1280px), Chrome, Firefox, Safari, Edge | 8 | ✅ PASS |
| [`src/__tests__/DebuggingCaseStudies.test.jsx`](./src/__tests__/DebuggingCaseStudies.test.jsx) | Regression | 4 real-world bug reproductions and verified fixes | 5 | ✅ PASS |

---

## 📑 Detailed Report
For the complete, extensive report containing worked-out code solutions, tooling justifications, browser compatibility matrices, and 4 in-depth debugging case studies, see **[`TESTING_AND_QUALITY_ASSURANCE_REPORT.md`](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)**.
