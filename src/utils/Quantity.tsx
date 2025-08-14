// Utility for scaling ingredient quantity strings when the number of persons changes

/**
 * Scales a quantity string according to a change in persons.
 * - Scales only if the string contains exactly one numeric token (supports dot/comma decimals)
 * - Preserves the rest of the string
 * - Uses ',' as decimal separator in the output
 * - Rounds to 2 decimals
 */
export function scaleQuantityForPersons(quantity: string, fromPersons: number, toPersons: number): string {
    if (fromPersons <= 0 || toPersons <= 0 || fromPersons === toPersons) {
        return quantity;
    }

    const numberTokenRegex = /\d+(?:[.,]\d+)?/g;
    const allNumbers = quantity.match(numberTokenRegex);
    if (!allNumbers || allNumbers.length !== 1) {
        return quantity;
    }

    const originalNumericToken = allNumbers[0];
    const numericValue = parseFloat(originalNumericToken.replace(',', '.'));
    if (isNaN(numericValue)) {
        return quantity;
    }

    const scaledValue = (numericValue * toPersons) / fromPersons;
    const rounded = Math.round(scaledValue * 100) / 100;
    const roundedStr = rounded.toString().replace('.', ',');

    return quantity.replace(originalNumericToken, roundedStr);
}


