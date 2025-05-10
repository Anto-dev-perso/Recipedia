import {palette} from './colors'
import {padding, remValue} from './spacing'
import EStyleSheet from "react-native-extended-stylesheet";

let shapeWidth: number = 1;

// Not use anymore
let opacityRound: number = 0.7;
let opacitySquare: number = 0.9;
let opacityRectangleRounded: number = 1;

export const mediumCardWidth = 120 * remValue;
export const smallCardWidth = 85 * remValue;


export const enum bottomTopPosition {
    top_left = 0,
    top_right = 1,
    top_center = 2,
    top_full = 3,
    bottom_left = 4,
    bottom_right = 5,
    bottom_center = 6,
    bottom_full = 7,
}

export const smallButtonDiameter = 40 * remValue;
export const mediumButtonDiameter = 50 * remValue;
export const LargeButtonDiameter = 60 * remValue;
export const BottomTopButtonOffset = LargeButtonDiameter + 10 * remValue;

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
});

export const squareButtonStyles = (side: number) => EStyleSheet.create({
    squareButton: {
        backgroundColor: palette.secondary,
        borderWidth: shapeWidth,
        borderColor: palette.bonusColor2,
        width: side,
        height: side,
        marginHorizontal: padding.small,
    },
});

export const rectangleButtonStyles = (rectHeight: number) => EStyleSheet.create({
    rectangleButton: {
        backgroundColor: palette.primary,
        borderWidth: shapeWidth,
        borderColor: palette.borderColor,
        height: rectHeight * remValue,
    }
});

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
    centeredView: {
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export const pressButtonStyle = (pressed: boolean) => EStyleSheet.create({
    pressButton: {
        backgroundColor: pressed ? palette.progressGrey : palette.backgroundColor
    }
});

export const wrappingButtonWithPressed = (pressed: boolean) => EStyleSheet.flatten([viewButtonStyles.wrappingListOfButton, pressButtonStyle(pressed).pressButton]);

export const viewInsideButtonCentered = EStyleSheet.flatten([viewButtonStyles.viewInsideButtons, viewButtonStyles.centeredView]);

const viewBottomTopButton = (offset: number) => EStyleSheet.create({
    bottomButton: {
        position: 'absolute',
        bottom: offset,
        padding: padding.small,
    },
    topButton: {
        position: 'absolute',
        top: -offset,
        padding: padding.small,
    },
});

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
});


export const bottomLeftButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.leftButton]);
export const bottomRightButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.rightButton]);
export const bottomCenterButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.centerButton]);
export const bottomFullButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).bottomButton, viewPosition.fullButton]);
export const topLeftButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.leftButton]);
export const topRightButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.rightButton]);
export const topCenterButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.centerButton]);
export const topFullButton = (offset: number) => EStyleSheet.flatten([viewBottomTopButton(offset).topButton, viewPosition.fullButton]);


export const rectangleRoundedButtonStyles = (rectRoundHeight: number) => EStyleSheet.create({
    rectangleRoundedButton: {
        backgroundColor: palette.accent,
        borderWidth: shapeWidth,
        borderColor: palette.bonusColor2,
        height: rectRoundHeight * remValue,
        borderRadius: (rectRoundHeight / 2) * remValue,
    }
});
