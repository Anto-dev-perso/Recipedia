export const mockUseSafeCopilot = jest.fn(() => null);

export const useSafeCopilotMock = () => ({
  useSafeCopilot: mockUseSafeCopilot,
});
