import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useI18n } from '@utils/i18n';
import { recipeTextStyles } from '@styles/recipeComponents';
import { Icons } from '@assets/Icons';
import RoundButton from '@components/atomic/RoundButton';

interface NutritionEmptyStateProps {
  onAddNutrition: () => void;
  parentTestId?: string;
}

export function NutritionEmptyState({ onAddNutrition, parentTestId }: NutritionEmptyStateProps) {
  const { t } = useI18n();

  const testId = parentTestId + '::NutritionEmptyState';

  return (
    <View style={recipeTextStyles.containerSection}>
      <Text
        variant={'headlineSmall'}
        style={recipeTextStyles.containerElement}
        testID={testId + '::Title'}
      >
        {t('recipe.nutrition.titleSimple')}
      </Text>
      <RoundButton
        testID={testId + '::AddButton'}
        size={'medium'}
        icon={Icons.plusIcon}
        onPressFunction={onAddNutrition}
        style={recipeTextStyles.button}
      />
    </View>
  );
}

export default NutritionEmptyState;
