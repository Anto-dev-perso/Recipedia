import React from 'react';

const mockToggleDarkMode = jest.fn();

export const DarkModeContext = React.createContext({
  isDarkMode: false,
  toggleDarkMode: mockToggleDarkMode,
});

export const useDarkMode = () => ({
  isDarkMode: false,
  toggleDarkMode: mockToggleDarkMode,
});

export { mockToggleDarkMode };
