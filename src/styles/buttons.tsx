/**
 * TODO fill this part
 * @format
 */

import { palette } from './colors'
import { padding, remValue } from './spacing'
import EStyleSheet from "react-native-extended-stylesheet";

let shapeWidth: number = 1;

// Not use anymore
let opacityRound: number = 0.7;
let opacitySquare: number = 0.9;
let opacityRectangleRounded: number = 1;


export const enum bottomPosition {
    left = 0,
    right = 1,
    center = 2,
    full = 3,
}

export const BottomButtonDiameter = 60 * remValue;
export const BottomButtonOffset = BottomButtonDiameter + 10 * remValue;

export const roundButtonStyles = (circleDiameter: number) => EStyleSheet.create({
    roundButton: {
        backgroundColor: palette.primary,
        overflow: 'hidden',
        borderRadius: (circleDiameter / 2),
        width: circleDiameter,
        height: circleDiameter,
        borderWidth: shapeWidth,
        padding: padding.medium,
        borderColor: palette.bonusColor2,
    },
})

export const squareButtonStyles = (side: number) => EStyleSheet.create({
    squareButton: {
        backgroundColor: palette.secondary,
        borderWidth: shapeWidth,
        borderColor: palette.bonusColor2,
        width: side,
        height: side,
        marginHorizontal: padding.medium,
    },
})

export const rectangleButtonStyles = (rectHeight: number) => EStyleSheet.create({
    rectangleButton: {
        backgroundColor: palette.primary,
        borderWidth: shapeWidth,
        borderColor: palette.borderColor,
        height: rectHeight * remValue,
}
})

export const rectangleButtonHeight = 75;

export const viewButtonStyles = EStyleSheet.create({
    viewContainingButton: {
        padding: padding.small,
    },
    viewInsideButtons: {
        flexDirection: 'row', 
        alignItems: 'center',
        height: '100%',
    },
    imageInsideButton: {
        width: '100%',
        height: '100%',
        contentFit: 'cover'
    },
    wrappingListOfButton: {
        flex: 1, 
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    longVerticalButton: {
        flexGrow: 1, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
    },
    longHorizontalButton: {
        paddingLeft: padding.extraLarge, 
        paddingVertical: padding.medium, 
        flexWrap: 'wrap',
    },
    centeredView : {
        justifyContent: 'center',
    }
})

export const viewInsideButtonCentered = EStyleSheet.flatten([viewButtonStyles.viewInsideButtons, viewButtonStyles.centeredView])

const viewBottomButton = (offset: number) => EStyleSheet.create({
    bottomButton: {
        position: 'absolute', 
        bottom: offset,
        padding: padding.small,
    },
})

export const viewPosition = EStyleSheet.create({
    leftButton: {
        left: 0,
    },
    rightButton: {
        right: 0,
    },
    centerButton: {
        width: '100%',
        alignItems: "center",
        justifyCOntent: 'center',
    },
    fullButton: {
        width: '100%',
        padding: 0, // overload padding because we won't it for a full width button
    },
    splitVerticallyIn2: {
            width: '50%',
            padding: padding.small,
        },
})


export const bottomLeftButton = (offset: number) => EStyleSheet.flatten([viewBottomButton(offset).bottomButton, viewPosition.leftButton])
export const bottomRightButton = (offset: number) => EStyleSheet.flatten([viewBottomButton(offset).bottomButton, viewPosition.rightButton])
export const bottomCenterButton = (offset: number) => EStyleSheet.flatten([viewBottomButton(offset).bottomButton, viewPosition.centerButton])
export const bottomFullButton = (offset: number) => EStyleSheet.flatten([viewBottomButton(offset).bottomButton, viewPosition.fullButton])



export const rectangleRoundedButtonStyles = (rectRoundHeight: number) => EStyleSheet.create({
    rectangleRoundedButton: {
    backgroundColor: palette.accent,
    borderWidth: shapeWidth,
    borderColor: palette.bonusColor2,
    height: rectRoundHeight * remValue,
    borderRadius: (rectRoundHeight/2) * remValue,
}
})