import React from 'react';
import { View } from 'react-native';

const mockInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

const mockFrame = {
  x: 0,
  y: 0,
  width: 390,
  height: 844,
};

export const SafeAreaInsetsContext = React.createContext(mockInsets);
export const SafeAreaFrameContext = React.createContext(mockFrame);

export const SafeAreaContext = React.createContext({
  insets: mockInsets,
  frame: mockFrame,
});

export const SafeAreaView = ({ children, ...props }: any) => <View {...props}>{children}</View>;

export const useSafeAreaInsets = () => mockInsets;

export const SafeAreaProvider = ({ children }: any) => (
  <SafeAreaContext.Provider value={{ insets: mockInsets, frame: mockFrame }}>
    {children}
  </SafeAreaContext.Provider>
);

export const useSafeAreaFrame = () => mockFrame;

export const initialWindowMetrics = {
  insets: mockInsets,
  frame: mockFrame,
};
