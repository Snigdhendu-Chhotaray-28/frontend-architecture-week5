import React from 'react';
import styled, { css } from 'styled-components';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: 24px;
  font-size: 0.95rem;
  font-weight: 500;
  backdrop-filter: blur(8px);
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid transparent;

  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'warning':
        return css`
          background: ${theme.colors.warningLight};
          color: ${theme.colors.warning};
          border-color: rgba(245, 158, 11, 0.3);
        `;
      case 'critical':
        return css`
          background: ${theme.colors.expenseLight};
          color: ${theme.colors.expense};
          border-color: rgba(244, 63, 94, 0.3);
        `;
      case 'success':
        return css`
          background: ${theme.colors.incomeLight};
          color: ${theme.colors.income};
          border-color: rgba(16, 185, 129, 0.3);
        `;
      default:
        return css`
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
          border-color: rgba(99, 102, 241, 0.3);
        `;
    }
  }}
`;

const ContentWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CloseButton = styled.button`
  color: inherit;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.05);
  }
`;

export const NotificationBanner = ({
  message,
  variant = 'info',
  onClose,
  id = 'notification-banner',
}) => {
  if (!message) return null;

  const renderIcon = () => {
    switch (variant) {
      case 'warning':
      case 'critical':
        return <AlertCircle size={20} aria-hidden="true" />;
      case 'success':
        return <CheckCircle size={20} aria-hidden="true" />;
      default:
        return <Info size={20} aria-hidden="true" />;
    }
  };

  return (
    <BannerContainer
      id={id}
      $variant={variant}
      role="alert"
      aria-live="polite"
    >
      <ContentWrapper>
        {renderIcon()}
        <span>{message}</span>
      </ContentWrapper>
      {onClose && (
        <CloseButton
          onClick={onClose}
          aria-label="Dismiss notification"
          data-testid="banner-close-btn"
        >
          <X size={18} />
        </CloseButton>
      )}
    </BannerContainer>
  );
};
