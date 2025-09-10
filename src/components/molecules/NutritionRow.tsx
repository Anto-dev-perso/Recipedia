import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { nutritionTableElement } from '@customTypes/DatabaseElementTypes';
import { recipeTextStyles } from '@styles/recipeComponents';
import { padding } from '@styles/spacing';

interface NutritionRowProps {
  label: string;
  value: number;
  unit: string;
  isSubItem?: boolean;
  isEditable?: boolean;
  field?: keyof nutritionTableElement;
  onValueChange?: (field: keyof nutritionTableElement, value: number) => void;
  testId: string;
}

export function NutritionRow({
  label,
  value,
  unit,
  isSubItem = false,
  isEditable = false,
  field,
  onValueChange,
  testId,
}: NutritionRowProps) {
  const handleTextChange = (text: string) => {
    if (field && onValueChange) {
      const numValue = parseFloat(text) || 0;
      onValueChange(field, numValue);
    }
  };

  const displayValue = value % 1 === 0 ? value.toString() : value.toFixed(1);

  return (
    <View>
      <View style={[recipeTextStyles.containerSection, styles.container]}>
        <Text
          variant='bodyMedium'
          style={[{ width: '60%' }, isSubItem && styles.subLabel]}
          testID={testId + '::Text'}
        >
          {isSubItem ? `${label}` : label}
        </Text>

        {isEditable && field ? (
          <TextInput
            testID={testId + '::TextInput'}
            value={value.toString()}
            onChangeText={handleTextChange}
            keyboardType='numeric'
            dense
            mode='outlined'
            style={{ width: '40%' }}
            right={<TextInput.Affix text={unit} />}
          />
        ) : (
          <Text variant='bodyMedium' testID={testId + '::Value'}>
            {displayValue} {unit}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  subLabel: {
    fontStyle: 'italic',
    paddingLeft: padding.medium,
    opacity: 0.8,
  },
});

export default NutritionRow;
