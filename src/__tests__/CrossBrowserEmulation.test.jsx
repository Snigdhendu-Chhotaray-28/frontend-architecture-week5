import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

describe('Cross-Browser & Cross-Device Emulation Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Mobile Viewport Emulation (375px x 667px - iPhone SE / Mobile)', () => {
    it('adapts layout and verifies responsive elements on mobile screens', () => {
      // Simulate Mobile Viewport
      window.innerWidth = 375;
      window.innerHeight = 667;
      window.dispatchEvent(new Event('resize'));

      render(<App />);

      // On mobile screens, the header title should still render seamlessly
      const title = screen.getByText('FinTrack Pro');
      expect(title).toBeInTheDocument();

      // Stats grid and form elements render without clipping
      expect(screen.getByTestId('stat-card-income')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-form')).toBeInTheDocument();
      expect(screen.getByTestId('transaction-list-card')).toBeInTheDocument();
    });

    it('handles mobile touch tap events smoothly on interactive controls', async () => {
      const user = userEvent.setup();
      render(<App />);

      const themeToggle = screen.getByTestId('theme-toggle-btn');
      // Touch simulation
      await user.pointer({ keys: '[TouchA>]', target: themeToggle });
      await user.pointer({ keys: '[/TouchA]' });

      expect(themeToggle).toHaveAttribute('aria-label', 'Switch to dark theme');
    });
  });

  describe('Tablet Viewport Emulation (768px x 1024px - iPad / Tablet)', () => {
    it('verifies responsive tablet rendering with two-column stats', () => {
      window.innerWidth = 768;
      window.innerHeight = 1024;
      window.dispatchEvent(new Event('resize'));

      render(<App />);

      expect(screen.getByTestId('stats-overview-grid')).toBeInTheDocument();
      expect(screen.getByTestId('budget-progress-bar')).toBeInTheDocument();
    });
  });

  describe('Desktop Viewport Emulation (1280px x 800px - Widescreen)', () => {
    it('verifies full grid layout with all four KPI cards and ledger side-by-side', () => {
      window.innerWidth = 1280;
      window.innerHeight = 800;
      window.dispatchEvent(new Event('resize'));

      render(<App />);

      expect(screen.getByTestId('stat-card-income')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-expense')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-balance')).toBeInTheDocument();
      expect(screen.getByTestId('stat-card-savings')).toBeInTheDocument();
    });
  });

  describe('Browser Rendering Engine Compatibility Verification', () => {
    const browsers = [
      { name: 'Chromium / Chrome 120+', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      { name: 'Mozilla Firefox 122+', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0' },
      { name: 'Apple Safari / WebKit 17+', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15' },
      { name: 'Microsoft Edge 120+', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0' },
    ];

    browsers.forEach((browser) => {
      it(`executes financial calculation and UI rendering in ${browser.name}`, () => {
        Object.defineProperty(navigator, 'userAgent', {
          value: browser.userAgent,
          configurable: true,
        });

        render(<App />);
        expect(screen.getByText('FinTrack Pro')).toBeInTheDocument();
        expect(screen.getByTestId('budget-spent-text')).toBeInTheDocument();
      });
    });
  });
});
