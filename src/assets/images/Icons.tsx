/**
 * TODO fill this part
 * @format
 */

import { MaterialCommunityIcons } from "@expo/vector-icons"
import { remValue } from "@styles/spacing";




export type materialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const checkboxBlank : materialIconName = "checkbox-blank-outline";
export const checkboxFill : materialIconName = "checkbox-marked";
export const plus : materialIconName = "plus";
export const minus : materialIconName = "minus";

export const checkboxIcons = [checkboxBlank, checkboxFill];
export const PlusMinusIcons = [plus, minus];

export const iconsSize = {
    small: 20 * remValue,
    medium: 27 * remValue,
    large: 40 * remValue,
}
