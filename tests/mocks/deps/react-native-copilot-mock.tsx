import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import type { CopilotContextType, CopilotOptions, Events, Step } from 'react-native-copilot';
import type { Emitter } from 'mitt';

const mockCopilotEvents: jest.Mocked<Emitter<Events>> = {
  on: jest.fn(),
  off: jest.fn(),
  emit: jest.fn(),
  all: new Map(),
};

const mockCopilotMethods: Partial<jest.Mocked<CopilotContextType>> = {
  start: jest.fn(),
  stop: jest.fn(),
  goToNext: jest.fn(),
  goToNth: jest.fn(),
  goToPrev: jest.fn(),
  registerStep: jest.fn(),
  unregisterStep: jest.fn(),
  copilotEvents: mockCopilotEvents,
};

interface MockCopilotState {
  isActive: boolean;
  currentStep: Step | null;
  isFirstStep: boolean;
  isLastStep: boolean;
  visible: boolean;
  currentStepNumber: number;
  totalStepsNumber: number;
  copilotEvents?: Emitter<Events> | null;
}

let mockCopilotState: MockCopilotState = {
  isActive: false,
  currentStep: null,
  isFirstStep: true,
  isLastStep: false,
  visible: false,
  currentStepNumber: 0,
  totalStepsNumber: 0,
  copilotEvents: mockCopilotEvents,
};

export const CopilotProvider: React.FC<PropsWithChildren<CopilotOptions>> = ({
  children,
  ...props
}) => (
  <View testID='CopilotProvider' {...props}>
    {children}
  </View>
);

interface CopilotStepProps {
  name: string;
  order: number;
  text: string;
  children: React.ReactElement;
  active?: boolean;
}

export const CopilotStep: React.FC<CopilotStepProps> = ({ children, name, ...props }) => (
  <View testID={`CopilotStep::${name}`} {...props}>
    {children}
  </View>
);

export const walkthroughable = <P = any,>(
  Component: React.ComponentType<P>
): React.FunctionComponent<P> => Component;

// Create a stable return object to prevent infinite re-renders
let stableCopilotReturn: CopilotContextType | null = null;

const updateStableCopilotReturn = () => {
  stableCopilotReturn = {
    ...mockCopilotMethods,
    ...mockCopilotState,
  } as CopilotContextType;
};

// Initialize stable return
updateStableCopilotReturn();

export const useCopilot = jest.fn((): CopilotContextType => {
  if (!mockCopilotState.isActive) {
    const error = new Error('useCopilot must be used within CopilotProvider');
    error.name = 'CopilotError';
    throw error;
  }
  return stableCopilotReturn!;
});

export const setMockCopilotState = (state: Partial<MockCopilotState>) => {
  mockCopilotState = { ...mockCopilotState, ...state };
  updateStableCopilotReturn();
};

export const getMockCopilotMethods = (): Partial<jest.Mocked<CopilotContextType>> =>
  mockCopilotMethods;

export const getMockCopilotEvents = (): jest.Mocked<Emitter<Events>> => mockCopilotEvents;

export const getEventHandler = (
  eventName: 'start' | 'stop' | 'stepChange'
): Function | undefined => {
  const calls = mockCopilotEvents.on.mock.calls;
  const eventCall = calls.find(call => call[0] === eventName);
  return eventCall ? eventCall[1] : undefined;
};

export const triggerStartEvent = (): void => {
  const handler = getEventHandler('start');
  if (handler) {
    handler();
  }
};

export const triggerStopEvent = (): void => {
  const handler = getEventHandler('stop');
  if (handler) {
    handler();
  }
};

export const triggerStepChangeEvent = (step: {
  name: string;
  order: number;
  text: string;
}): void => {
  const handler = getEventHandler('stepChange');
  if (handler) {
    handler(step);
  }
};

export const resetMockCopilot = (): void => {
  mockCopilotState = {
    isActive: false,
    currentStep: null,
    isFirstStep: true,
    isLastStep: false,
    visible: false,
    currentStepNumber: 0,
    totalStepsNumber: 0,
    copilotEvents: mockCopilotEvents,
  };

  updateStableCopilotReturn();
  jest.clearAllMocks();
};
