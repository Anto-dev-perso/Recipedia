/**
 * TODO fill this part
 * @format
 */

import { palette } from './colors'
import { padding } from './spacing'
import { imageStyle } from './images'
import EStyleSheet from "react-native-extended-stylesheet";

let shapeWidth: number = 1;

// Not use anymore
let opacityRound: number = 0.7;
let opacitySquare: number = 0.9;
let opacityRectangleRounded: number = 1;

const roundButtonStyles = (circleDiameter: number) => EStyleSheet.create({
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

const squareButtonStyles = (side: number) => EStyleSheet.create({
    squareButton: {
        backgroundColor: palette.secondary,
        borderWidth: shapeWidth,
        borderColor: palette.bonusColor2,
        width: side,
        height: side,
        marginHorizontal: padding.medium,
    },
})

const rectangleButtonStyles = EStyleSheet.create({
    rectangleButton: {
    backgroundColor: palette.primary,
    borderWidth: shapeWidth,
    borderColor: palette.borderColor,
}
})

const viewButtonStyles = EStyleSheet.create({
    viewContainingButton: {
        padding: padding.small,
    },
    viewInsideButtons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    imageInsideButton: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    wrappingListOfButton: {
        flex: 1, 
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    bottomButton: {
        width: '100%', 
        height: "75rem", 
        position: 'absolute', 
        bottom: 0}
})

const rectangleRoundHeight = "30rem";

const rectangleRoundedButtonStyles = EStyleSheet.create({
    rectangleRoundedButton: {
    backgroundColor: palette.accent,
    borderWidth: shapeWidth,
    borderColor: palette.bonusColor2,

    height: rectangleRoundHeight,
    borderRadius: rectangleRoundHeight,
}
})


export { opacityRound, opacitySquare, opacityRectangleRounded, roundButtonStyles, squareButtonStyles, rectangleButtonStyles, rectangleRoundedButtonStyles, viewButtonStyles} 