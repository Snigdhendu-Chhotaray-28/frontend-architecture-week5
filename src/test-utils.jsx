import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './styles/theme';

export const renderWithTheme = (ui, { theme = darkTheme, ...renderOptions } = {}) => {
  const Wrapper = ({ children }) => (
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export const renderWithLightTheme = (ui, options = {}) => {
  return renderWithTheme(ui, { theme: lightTheme, ...options });
};
