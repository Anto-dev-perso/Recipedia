/**
 * VerticalBottomButtons - Expandable floating action button menu
 *
 * A sophisticated FAB menu component that provides quick access to recipe creation
 * actions. Features an expandable design that reveals multiple action buttons when
 * activated, including camera capture, gallery selection, and manual entry options.
 *
 * Key Features:
 * - Expandable/collapsible FAB menu design
 * - Four distinct recipe creation methods
 * - Integrated image capture and selection
 * - Automatic navigation to recipe creation screens
 * - Vertical stacking with calculated offsets
 * - Theme-aware styling and theming
 * - Smooth state transitions between collapsed/expanded
 *
 * @example
 * ```typescript
 * // Usage in main screens (typically Home screen)
 * <VerticalBottomButtons />
 *
 * // The component automatically handles:
 * // - Camera photo capture → Recipe creation from image
 * // - Gallery image selection → Recipe creation from image
 * // - Manual recipe creation → Empty recipe form
 * // - Menu expansion/collapse state management
 * ```
 */

import React, { useState } from 'react';
import BottomTopButton from '@components/molecules/BottomTopButton';
import { BottomTopButtonOffset, bottomTopPosition } from '@styles/buttons';
import { View } from 'react-native';
import { pickImage, takePhoto } from '@utils/ImagePicker';
import { Icons } from '@assets/Icons';
import { StackScreenNavigation } from '@customTypes/ScreenTypes';
import { useNavigation } from '@react-navigation/native';
import RoundButton from '@components/atomic/RoundButton';
import { useTheme } from 'react-native-paper';

/**
 * VerticalBottomButtons component for expandable recipe creation menu
 *
 * @returns JSX element representing an expandable FAB menu for recipe creation actions
 */
export default function VerticalBottomButtons() {
  const { navigate } = useNavigation<StackScreenNavigation>();
  const { colors } = useTheme();

  const [multipleLayout, setMultipleLayout] = useState(false);

  // TODO add a loading because camera can takes a while
  async function takePhotoAndOpenNewRecipe() {
    openRecipeWithUri(await takePhoto(colors));
  }

  async function pickImageAndOpenNewRecipe() {
    openRecipeWithUri(await pickImage(colors));
  }

  function openRecipeWithUri(uri: string) {
    if (uri.length > 0) {
      navigate('Recipe', { mode: 'addFromPic', imgUri: uri });
    }
  }

  return (
    <View>
      {multipleLayout ? (
        <View>
          <BottomTopButton
            testID={'ReduceButton'}
            as={RoundButton}
            position={bottomTopPosition.bottom_right}
            size={'medium'}
            icon={Icons.minusIcon}
            onPressFunction={() => setMultipleLayout(false)}
          />

          <BottomTopButton
            testID={'EditButton'}
            as={RoundButton}
            position={bottomTopPosition.bottom_right}
            size={'medium'}
            buttonOffset={BottomTopButtonOffset}
            icon={Icons.pencilIcon}
            onPressFunction={() =>
              navigate('Recipe', {
                mode: 'addManually',
              })
            }
          />

          <BottomTopButton
            testID={'GalleryButton'}
            as={RoundButton}
            position={bottomTopPosition.bottom_right}
            size={'medium'}
            buttonOffset={2 * BottomTopButtonOffset}
            icon={Icons.galleryIcon}
            onPressFunction={pickImageAndOpenNewRecipe}
          />

          <BottomTopButton
            testID={'CameraButton'}
            as={RoundButton}
            position={bottomTopPosition.bottom_right}
            size={'medium'}
            buttonOffset={3 * BottomTopButtonOffset}
            icon={Icons.cameraIcon}
            onPressFunction={takePhotoAndOpenNewRecipe}
          />
        </View>
      ) : (
        <BottomTopButton
          testID={'ExpandButton'}
          as={RoundButton}
          position={bottomTopPosition.bottom_right}
          size={'medium'}
          icon={Icons.plusIcon}
          onPressFunction={() => setMultipleLayout(true)}
        />
      )}
    </View>
  );
}
