# FinTrack Pro – Enterprise React Testing & Quality Assurance Suite

[![Tests](https://img.shields.io/badge/Tests-96%20Passed-success?style=for-the-badge&logo=vitest)](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)
[![Coverage](https://img.shields.io/badge/Coverage-99.56%25%20Lines-brightgreen?style=for-the-badge&logo=codecov)](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)
[![Lint](https://img.shields.io/badge/ESLint-0%20Warnings-success?style=for-the-badge&logo=eslint)](./eslint.config.js)
[![Styling](https://img.shields.io/badge/Styling-styled--components%20CSS--in--JS-informational?style=for-the-badge&logo=styled-components)](./src/styles/theme.js)
[![React](https://img.shields.io/badge/React-18.3.1-blue?style=for-the-badge&logo=react)](https://react.dev)

> A modern personal & enterprise financial intelligence dashboard engineered with React 18, strict CSS-in-JS (`styled-components`), and an end-to-end quality assurance suite (Vitest + React Testing Library + ESLint).

---

## 📸 Cross-Browser & Cross-Device Visual Proof

| Google Chrome – Desktop Dark Theme | Google Chrome – Desktop Light Theme |
| :---: | :---: |
| ![Chrome Desktop Dark](screenshots/chrome-desktop-dark.png) | ![Chrome Desktop Light](screenshots/chrome-desktop-light.png) |

| Critical Budget Exceeded Alert (ARIA role="alert") | Microsoft Edge – Desktop Verification |
| :---: | :---: |
| ![Budget Exceeded Alert](screenshots/chrome-budget-alert.png) | ![Edge Desktop](screenshots/edge-desktop-dark.png) |

| Tablet Viewport (768px – iPad) | Mobile Viewport (375px – iPhone SE) |
| :---: | :---: |
| ![Tablet iPad Viewport](screenshots/chrome-tablet.png) | ![Mobile iPhone SE Viewport](screenshots/chrome-mobile.png) |

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
# Run all 96 tests across 13 test suites
npm test

# Run tests with real-time watch mode
npm run test:watch

# Generate full V8 test coverage table and HTML report (99.56% coverage)
npm run test:coverage
```

### 4. Code Quality & Linting
```bash
# Execute ESLint 9 static analysis under 0-warning policy
npm run lint
```

### 5. Cross-Browser Automated Screenshot Capture
```bash
# Automatically launches Chrome and Edge to capture fresh screenshots
node capture_screenshots.js
```

### 6. Build for Production
```bash
npm run build
npm run preview
```

---

## 📊 Test Suite & Coverage Overview

- **Test Files:** 13 passed (13 total)
- **Tests:** 96 passed (96 total)
- **Statements Coverage:** 99.56%
- **Branch Coverage:** 96.51%
- **Functions Coverage:** 93.68%
- **Lines Coverage:** 99.56%

| Test Suite File | Layer | Description | Tests | Status |
| :--- | :--- | :--- | :---: | :---: |
| [`src/utils/__tests__/finance.test.js`](./src/utils/__tests__/finance.test.js) | Unit | Financial calculations, currency formatting, validation | 30 | ✅ PASS |
| [`src/services/__tests__/storage.test.js`](./src/services/__tests__/storage.test.js) | Unit | LocalStorage service, corrupted JSON recovery, quota errors | 12 | ✅ PASS |
| [`src/components/__tests__/StatCard.test.jsx`](./src/components/__tests__/StatCard.test.jsx) | Unit | KPI metric cards & ARIA labels | 4 | ✅ PASS |
| [`src/components/__tests__/BudgetProgressBar.test.jsx`](./src/components/__tests__/BudgetProgressBar.test.jsx) | Unit | Progress bar, 80%/100% warnings, inline edit | 4 | ✅ PASS |
| [`src/components/__tests__/TransactionItem.test.jsx`](./src/components/__tests__/TransactionItem.test.jsx) | Unit | Transaction row rendering & delete actions | 3 | ✅ PASS |
| [`src/components/__tests__/TransactionForm.test.jsx`](./src/components/__tests__/TransactionForm.test.jsx) | Unit | Controlled inputs, validation errors, submit | 5 | ✅ PASS |
| [`src/components/__tests__/TransactionList.test.jsx`](./src/components/__tests__/TransactionList.test.jsx) | Unit | Ledger filtering, title/amount sorting, empty states | 7 | ✅ PASS |
| [`src/components/__tests__/CategoryBreakdown.test.jsx`](./src/components/__tests__/CategoryBreakdown.test.jsx) | Unit | Expense distribution and empty states | 2 | ✅ PASS |
| [`src/components/__tests__/NotificationBanner.test.jsx`](./src/components/__tests__/NotificationBanner.test.jsx) | Unit | Accessible live-region banners & dismiss callbacks | 4 | ✅ PASS |
| [`src/__tests__/test-utils.test.jsx`](./src/__tests__/test-utils.test.jsx) | Unit | Theme provider test wrapper isolated rendering | 2 | ✅ PASS |
| [`src/__tests__/App.integration.test.jsx`](./src/__tests__/App.integration.test.jsx) | Integration | End-to-end component interaction flows, budget alerts | 9 | ✅ PASS |
| [`src/__tests__/CrossBrowserEmulation.test.jsx`](./src/__tests__/CrossBrowserEmulation.test.jsx) | Emulation | Mobile (375px), Tablet (768px), Desktop (1280px), Chrome, Firefox, Safari, Edge | 8 | ✅ PASS |
| [`src/__tests__/DebuggingCaseStudies.test.jsx`](./src/__tests__/DebuggingCaseStudies.test.jsx) | Regression | 5 real-world bug reproductions and verified fixes | 6 | ✅ PASS |

---

## 🛠️ Debugging Case Studies & Fixes

FinTrack Pro documents **5 thorough debugging case studies** with reproduction, root cause analysis, code diffs, and regression tests:
1. **Case Study 1: IEEE 754 Floating-Point Precision Error:** Summing `$0.10 + $0.20` resulted in `0.30000000000000004`. Resolved using integer-cents fixed-point math (`Math.round(amount * 100)`).
2. **Case Study 2: Double-Click Race Condition on Form Submission:** Rapid user clicking created duplicate ledger records. Resolved using an `isSubmitting` latch and synchronous button disabling.
3. **Case Study 3: LocalStorage Schema Corruption Crash:** Corrupted JSON strings caused unhandled `SyntaxError`s resulting in a white screen. Hardened with robust `try...catch` and fallback data hydration.
4. **Case Study 4: Accessibility Violation on Dynamic Alerts:** Screen readers failed to announce critical budget warnings. Fixed by adding `role="alert"` and `aria-live="polite"`.
5. **Case Study 5: Date Timezone Midnight Boundary Shift:** `new Date('YYYY-MM-DD')` default UTC midnight shifted dates back by 1 day in negative UTC offsets (EST/PST). Resolved via explicit component calendar parsing.

---

## 📑 Detailed Report
For the complete report containing worked-out code solutions, tooling justifications, browser compatibility matrices, real terminal logs, and in-depth debugging case studies, see **[`TESTING_AND_QUALITY_ASSURANCE_REPORT.md`](./TESTING_AND_QUALITY_ASSURANCE_REPORT.md)**.
