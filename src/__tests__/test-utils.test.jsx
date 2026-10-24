import React from 'react';
import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import styled from 'styled-components';
import { renderWithTheme, renderWithLightTheme } from '../test-utils';

const TestBox = styled.div`
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

describe('Test Utils Theme Wrappers', () => {
  it('renders correctly with default dark theme wrapper', () => {
    renderWithTheme(<TestBox data-testid="test-box">Dark Theme Box</TestBox>);
    expect(screen.getByTestId('test-box')).toBeInTheDocument();
  });

  it('renders correctly with light theme wrapper', () => {
    renderWithLightTheme(<TestBox data-testid="light-test-box">Light Theme Box</TestBox>);
    expect(screen.getByTestId('light-test-box')).toBeInTheDocument();
  });
});
