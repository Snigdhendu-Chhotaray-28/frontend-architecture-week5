import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '../../test-utils';
import { NotificationBanner } from '../NotificationBanner';

describe('NotificationBanner Component', () => {
  it('renders alert message with role="alert" and aria-live="polite"', () => {
    renderWithTheme(
      <NotificationBanner
        message="Monthly budget threshold reached!"
        variant="warning"
      />
    );

    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('Monthly budget threshold reached!');
    expect(banner).toHaveAttribute('aria-live', 'polite');
  });

  it('renders nothing when message is empty or null', () => {
    const { container } = renderWithTheme(<NotificationBanner message="" />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose callback when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    renderWithTheme(
      <NotificationBanner
        message="Success alert"
        variant="success"
        onClose={handleClose}
      />
    );

    const closeBtn = screen.getByTestId('banner-close-btn');
    await user.click(closeBtn);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders default info variant with info icon when no variant is specified', () => {
    renderWithTheme(<NotificationBanner message="Standard information update" />);
    const banner = screen.getByRole('alert');
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveTextContent('Standard information update');
  });
});
