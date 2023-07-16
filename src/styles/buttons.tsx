/**
 * TODO fill this part
 * @format
 */

import { StyleSheet } from "react-native"
import { palette } from './colors'
import { padding } from './spacing'

let shapeWidth: number = 1;

// Not use anymore
let opacityRound: number = 0.7;
let opacitySquare: number = 0.9;
let opacityRectangleRounded: number = 1;

const roundButtonStyles = (circleDiameter: number) => StyleSheet.create({
    roundButton: {
        backgroundColor: palette.primary,
        overflow: 'hidden',
        borderRadius: (circleDiameter / 2),
        width: circleDiameter,
        height: circleDiameter,
        borderWidth: shapeWidth,
        padding: padding.small,
        borderColor: palette.bonusColor2,
    },
})

const squareButtonStyles = (side: number) => StyleSheet.create({
    squareButton: {
        backgroundColor: palette.secondary,
        borderWidth: shapeWidth,
        borderColor: palette.bonusColor2,
        width: side,
        height: side,
        marginLeft: padding.small,
        marginRight: padding.small,
    },
})

const viewButtonStyles= StyleSheet.create({
    viewContainingButton: {
        padding: padding.small,
    },
    viewInsideButtons: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageInsideButton: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    }
})

const rectangleRoundedButtonStyles = (length: number) => StyleSheet.create({
rectangleRoundedButton: {
    backgroundColor: palette.accent,
    borderWidth: shapeWidth,
    borderColor: palette.bonusColor2,

    height: length,
    width: (length * 2),
    borderRadius: (length / 3)
}
})


export { opacityRound, opacitySquare, opacityRectangleRounded, roundButtonStyles, squareButtonStyles, rectangleRoundedButtonStyles, viewButtonStyles} 