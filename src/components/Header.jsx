import React from 'react';
import styled from 'styled-components';
import { Moon, Sun, ShieldCheck, Wallet } from 'lucide-react';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 0;
  margin-bottom: 28px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  flex-wrap: wrap;
  gap: 16px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const AppTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.text}, ${({ theme }) => theme.colors.primary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: 1.25rem;
  }
`;

const AppSubtitle = styled.p`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QualityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radii.full};
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  border: 1px solid rgba(99, 102, 241, 0.2);

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceSubtle};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.colors.shadowMd};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
  }
`;

export const Header = ({ currentTheme, onToggleTheme }) => {
  return (
    <HeaderContainer id="main-header">
      <LogoSection>
        <LogoIconBox aria-hidden="true">
          <Wallet size={24} />
        </LogoIconBox>
        <TitleGroup>
          <AppTitle>FinTrack Pro</AppTitle>
          <AppSubtitle>Enterprise Finance Tracker & Quality Testbed</AppSubtitle>
        </TitleGroup>
      </LogoSection>

      <ActionsGroup>
        <QualityBadge aria-label="Quality assurance test suite status: Active">
          <ShieldCheck size={14} />
          <span>QA Verified (100% RTL)</span>
        </QualityBadge>

        <ThemeButton
          onClick={onToggleTheme}
          aria-label={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          title={currentTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          data-testid="theme-toggle-btn"
        >
          {currentTheme === 'dark' ? (
            <Sun size={20} color="#fbbf24" aria-hidden="true" />
          ) : (
            <Moon size={20} color="#4f46e5" aria-hidden="true" />
          )}
        </ThemeButton>
      </ActionsGroup>
    </HeaderContainer>
  );
};
