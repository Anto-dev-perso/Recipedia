import React from 'react';
import { View } from 'react-native';
import { Divider, Text, TextInput, useTheme } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import { recipeTextStyles } from '@styles/recipeComponents';
import { padding } from '@styles/spacing';
import WrappableButton from '@components/atomic/WrappableButton';

interface NutritionEditFormProps {
  portionWeight: number;
  onPortionWeightChange: (weight: number) => void;
  onRemoveNutrition?: () => void;
  showRemoveButton?: boolean;
  testId: string;
}

export function NutritionEditForm({
  portionWeight,
  onPortionWeightChange,
  onRemoveNutrition,
  showRemoveButton = false,
  testId,
}: NutritionEditFormProps) {
  const { colors } = useTheme();
  const { t } = useI18n();

  const handleWeightChange = (text: string) => {
    const numValue = parseFloat(text) || 100;
    onPortionWeightChange(numValue);
  };

  return (
    <View>
      <Divider />
      <View testID={testId}>
        <View style={recipeTextStyles.containerSection}>
          <Text
            variant='labelLarge'
            style={recipeTextStyles.containerElement}
            testID={testId + '::PortionWeightText'}
          >
            {t('recipe.nutrition.portionWeight')}
          </Text>
          <TextInput
            testID={testId + '::PortionWeightTextInput'}
            value={portionWeight.toString()}
            onChangeText={handleWeightChange}
            style={recipeTextStyles.containerElement}
            keyboardType='numeric'
            mode='outlined'
            dense
            right={<TextInput.Affix text='g' />}
          />

          {showRemoveButton && onRemoveNutrition && (
            <WrappableButton
              testID={testId + '::RemoveButton'}
              onPress={onRemoveNutrition}
              textColor={colors.onError}
              buttonColor={colors.error}
              style={{ marginTop: padding.large }}
            >
              {t('recipe.nutrition.removeNutrition')}
            </WrappableButton>
          )}
        </View>
      </View>
    </View>
  );
}

export default NutritionEditForm;
