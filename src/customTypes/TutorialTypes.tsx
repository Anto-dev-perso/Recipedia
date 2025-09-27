/**
 * TutorialTypes - Type definitions for tutorial and copilot functionality
 *
 * This module provides TypeScript type definitions for the tutorial system
 * using react-native-copilot, ensuring type safety across tutorial operations.
 *
 * Key Features:
 * - Type-safe copilot step definitions
 * - Tutorial event handling types
 * - Demo timing configuration types
 * - Integration with react-native-copilot library
 */

/**
 * Type definition for copilot step object
 * Represents a single step in the guided tutorial flow
 */
export interface CopilotStepData {
  /** Numeric order of the step in the tutorial sequence */
  order: number;
  /** Unique identifier/name for the step */
  name: string;
  /** Display text/description shown to the user */
  text: string;
}
