import { useCopilot } from 'react-native-copilot';

/**
 * Safe wrapper for useCopilot hook that handles cases where CopilotProvider is not available
 *
 * @returns Copilot hook data or null if provider is not available
 */
export function useSafeCopilot() {
  try {
    return useCopilot();
  } catch {
    return null;
  }
}
