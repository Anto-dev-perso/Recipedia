import {separateNumbersFromStr} from "@styles/typography";

export function isString(val: unknown): boolean {
    return typeof val === 'string';
}

export function isNumber(val: unknown): boolean {
    return !isNaN(Number(val));
}

export function isArrayOfNumber(val: unknown): boolean {
    return Array.isArray(val) && val.every(v => isNumber(v));
}

export function isArrayOfString(val: unknown): boolean {
    return Array.isArray(val) && val.every(v => isString(v));
}

export function isArrayOfType<T>(val: unknown, keys: (keyof T)[]): boolean {
    return Array.isArray(val) && val.every(v => isOfType<T>(v, keys));
}

export function isOfType<T>(val: any, keys: (keyof T)[]): boolean {
    return val && typeof val === 'object' && hasSameKeysAs<T>(val, keys);
}

export function hasSameKeysAs<T>(val: unknown, keys: (keyof T)[]): boolean {
    if (typeof val !== 'object' || val === null) return false;

    const valKeys = Object.keys(val);
    return (
        valKeys.length === keys.length &&
        keys.every(key => valKeys.includes(key as string))
    );
}

// TODO to test
export function sumNumberInString(lhs: string, rhs: string) {
    return operatorNumberInString(lhs, rhs, '+');
}

export function subtractNumberInString(lhs: string, rhs: string) {
    return operatorNumberInString(lhs, rhs, '-');
}


function operatorNumberInString(lhs: string, rhs: string, operator: '+' | '-') {
    const applyOp = (lhs: number, rhs: number): number => {
        switch (operator) {
            case '+':
                return lhs + rhs;
            case '-':
                return lhs - rhs;
        }
    };

    const lhsIsNumber = isNumber(lhs);
    const rhsIsNumber = isNumber(rhs);
    if (lhsIsNumber && rhsIsNumber) {
        return applyOp(Number(lhs), Number(rhs)).toString();
    } else if (!lhsIsNumber && !rhsIsNumber) {
        const tokens1 = lhs.match(separateNumbersFromStr) || [];
        const tokens2 = rhs.match(separateNumbersFromStr) || [];

        return tokens1.map((token, i) => {
            const other = tokens2[i] ?? '';
            if (isNumber(token) && isNumber(other)) {
                return applyOp(Number(token), Number(other)).toString();
            }
            if (token === other) return token;
            return token + other;
        }).join('');
    } else {
        console.error("Can't have one which can be a number and other which cannot be: ", lhs, " ", rhs);
        return lhs + rhs;
    }
}
