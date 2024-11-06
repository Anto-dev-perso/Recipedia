/**
* TODO fill this part
* @format
*/


import React from 'react'
import { useContext, useEffect, useRef, useState } from 'react'
import { Animated, LayoutRectangle, StyleSheet, View } from 'react-native'
import { GestureEvent, GestureHandlerRootView, HandlerStateChangeEvent, HandlerStateChangeEventPayload, PanGestureHandler, PanGestureHandlerEventPayload, State } from 'react-native-gesture-handler'
import { remValue } from '@styles/spacing'
import { cameraPalette } from '@styles/colors'
import { cropData, localImgData, Layout } from '@customTypes/ImageTypes';

export type CropRectangleProps = {
    imageBounds: LayoutRectangle,
    datas: cropData
}

const horizontalSections = ['top', 'middle', 'bottom'];
const verticalSections = ['left', 'middle', 'right'];

type GestureHandlerEventPayloadType =
GestureEvent<PanGestureHandlerEventPayload>
type HandlerStateChangeEventType =
HandlerStateChangeEvent<PanGestureHandlerEventPayload>

const CropRectangle = (props: CropRectangleProps) => {

    const cropSize = props.datas.rectSize;
    const accumulatedPan = props.datas.pan;

    const [selectedFrameSection, setSelectedFrameSection] = useState('')
    
    const gridOverlayColor = cameraPalette.selectorColor;
    const coverMarker = {show: true, color: cameraPalette.cornersColor};
    const overlayCropColor = cameraPalette.selectorColor;
    
    const fixedAspectRatio = 0.66666666666;
    const minimumCropDimensions = { width: 100*remValue, height: 100*remValue };
    
    const [animatedCropSize] = useState({
        width: new Animated.Value(cropSize.width),
        height: new Animated.Value(cropSize.height),
    })
    const panX = useRef(new Animated.Value(props.imageBounds.x))
    const panY = useRef(new Animated.Value(props.imageBounds.y))
    
    useEffect(() => {
        checkCropBounds({
            translationX: 0,
            translationY: 0,
        })
        animatedCropSize.height.setValue(cropSize.height)
        animatedCropSize.width.setValue(cropSize.width)
    }, [cropSize])
    
    useEffect(() => {
        const newSize: Layout = {width: 0, height: 0 }
        const { width, height } = props.imageBounds
        const imageAspectRatio = width / height
        
        if (fixedAspectRatio < imageAspectRatio) {
            newSize.height = height
            newSize.width = height * fixedAspectRatio
        } else {
            newSize.width = width
            newSize.height = width / fixedAspectRatio
        }
        props.datas.rectSizeSetter(newSize);
    }, [props.imageBounds])
    
    const isMovingSection = () =>
    selectedFrameSection === 'topmiddle' ||
    selectedFrameSection === 'middleleft' ||
    selectedFrameSection === 'middleright' ||
    selectedFrameSection === 'middlemiddle' ||
    selectedFrameSection === 'bottommiddle'
    
    const isLeft = selectedFrameSection.endsWith('left')
    const isTop = selectedFrameSection.startsWith('top')
    
    const onOverlayMove = ({ nativeEvent }: GestureHandlerEventPayloadType) => {
        if (selectedFrameSection !== '') {
            if (isMovingSection()) {
                Animated.event(
                    [
                        {
                            translationX: panX.current,
                            translationY: panY.current,
                        },
                    ],
                    { useNativeDriver: false },
                    )(nativeEvent)
                } else {
                    const { x, y } = getTargetCropFrameBounds(nativeEvent)
                    
                    if (isTop) {
                        panY.current.setValue(-y)
                    }
                    
                    if (isLeft) {
                        panX.current.setValue(-x)
                    }
                    
                    animatedCropSize.width.setValue(cropSize.width + x)
                    animatedCropSize.height.setValue(cropSize.height + y)
                }
            } else {
                const { x, y } = nativeEvent
                const { width: initialWidth, height: initialHeight } = cropSize
                let position = ''
                
                if (y / initialHeight < 0.333) {
                    position = position + 'top'
                } else if (y / initialHeight < 0.667) {
                    position = position + 'middle'
                } else {
                    position = position + 'bottom'
                }
                
                if (x / initialWidth < 0.333) {
                    position = position + 'left'
                } else if (x / initialWidth < 0.667) {
                    position = position + 'middle'
                } else {
                    position = position + 'right'
                }
                
                setSelectedFrameSection(position)
            }
        }
        
        type Translate = {
            translationX: number
            translationY: number
        }
        
        const getTargetCropFrameBounds = ({
            translationX,
            translationY,
        }: Translate) => {
            let x = 0
            let y = 0
            
            if (translationX && translationY) {
                if (translationX < translationY) {
                    x = (isLeft ? -1 : 1) * translationX
                    y = x / fixedAspectRatio
                } else {
                    y = (isTop ? -1 : 1) * translationY
                    x = y * fixedAspectRatio
                }
            }
            
            return { x, y }
        }
        
        const onOverlayRelease = (
            nativeEvent: Readonly<
            HandlerStateChangeEventPayload & PanGestureHandlerEventPayload
            >,
            ) => {
                isMovingSection()
                ? checkCropBounds(nativeEvent)
                : checkResizeBounds(nativeEvent)
                setSelectedFrameSection('')
            }
            
            const onHandlerStateChange = ({
                nativeEvent,
            }: HandlerStateChangeEventType) => {
                if (nativeEvent.state === State.END) onOverlayRelease(nativeEvent)
            }
            
            const checkCropBounds = ({ translationX, translationY }: Translate) => {
                let accDx = accumulatedPan.x + translationX
                
                if (accDx <= props.imageBounds.x) {
                    accDx = props.imageBounds.x
                } else if (accDx + cropSize.width > props.imageBounds.width + props.imageBounds.x) {
                    accDx = props.imageBounds.x + props.imageBounds.width - cropSize.width
                }
                
                let accDy = accumulatedPan.y + translationY
                
                if (accDy <= props.imageBounds.y) {
                    accDy = props.imageBounds.y
                } else if (accDy + cropSize.height > props.imageBounds.height + props.imageBounds.y) {
                    accDy = props.imageBounds.y + props.imageBounds.height - cropSize.height
                }
                
                panX.current.setValue(0)
                panY.current.setValue(0)
                props.datas.panSetter({ x: accDx, y: accDy })
            }
            
            const checkResizeBounds = ({ translationX, translationY }: Translate) => {
                let { width: maxWidth, height: maxHeight } = props.imageBounds
                const { width: minWidth, height: minHeight } = minimumCropDimensions
                
                const height = maxWidth / fixedAspectRatio
                if (maxHeight > height) maxHeight = height
                
                const width = maxHeight * fixedAspectRatio
                if (maxWidth > width) maxWidth = width
                
                const { x, y } = getTargetCropFrameBounds({ translationX, translationY })
                const animatedWidth = cropSize.width + x
                const animatedHeight = cropSize.height + y
                let finalHeight = animatedHeight
                let finalWidth = animatedWidth
                
                if (animatedHeight > maxHeight) {
                    finalHeight = maxHeight
                    finalWidth = finalHeight * fixedAspectRatio
                } else if (animatedHeight < minHeight) {
                    finalHeight = minHeight
                    finalWidth = finalHeight * fixedAspectRatio
                }
                
                if (animatedWidth > maxWidth) {
                    finalWidth = maxWidth
                    finalHeight = maxHeight
                } else if (animatedWidth < minWidth) {
                    finalWidth = minWidth
                    finalHeight = finalWidth / fixedAspectRatio
                }
                
                props.datas.panSetter({x: accumulatedPan.x + (isLeft ? -x : 0), y: accumulatedPan.y + (isTop ? -y : 0)})
                
                panX.current.setValue(0)
                panY.current.setValue(0)
                
                props.datas.rectSizeSetter({height: finalHeight, width: finalWidth})
            }
            
            return (
                <View style={styles.container}>
                <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler onGestureEvent={onOverlayMove} onHandlerStateChange={(e) => onHandlerStateChange(e)} >
                <Animated.View
                style={[styles.overlay,{backgroundColor: overlayCropColor, borderColor: gridOverlayColor}, animatedCropSize, {transform: [{ translateX: Animated.add(panX.current, accumulatedPan.x) }, { translateY: Animated.add(panY.current, accumulatedPan.y)}]}]} >
                {horizontalSections.map((horizontalSection) => {
                    return (
                        <View style={styles.sectionRow} key={horizontalSection}>
                        {verticalSections.map((verticalSection) => {
                            const key = horizontalSection + verticalSection
                            return (
                                <View style={[styles.defaultSection, { borderColor: gridOverlayColor, opacity: 1}]} key={key} >
                                {key === 'topleft' || key === 'topright' || key === 'bottomleft' || key === 'bottomright' ? 
                                coverMarker?.show && (
                                    <View style={[styles.cornerMarker,  { borderColor: coverMarker?.color }, 
                                        horizontalSection === 'top' ? { top: -4, borderTopWidth: 7 } : { bottom: -4, borderBottomWidth: 7 }, 
                                        verticalSection === 'left' ? { left: -4, borderLeftWidth: 7 } : { right: -4, borderRightWidth: 7 }]} />
                                        )
                                        : null}
                                        </View>
                                        )
                                    })}
                                    </View>
                                    )
                                })}
                                </Animated.View>
                                </PanGestureHandler>
                                </GestureHandlerRootView>
                                </View>
                                )
                            }
                            
                            export { CropRectangle }
                            
                            const styles = StyleSheet.create({
                                container: {
                                    height: '100%',
                                    width: '100%',
                                    position: 'absolute',
                                },
                                overlay: {
                                    height: 40,
                                    width: 40,
                                    borderWidth: 1,
                                },
                                sectionRow: {
                                    flexDirection: 'row',
                                    flex: 1,
                                },
                                defaultSection: {
                                    flex: 1,
                                    borderWidth: 0.5,
                                    justifyContent: 'center',
                                    alignItems: 'center', 
                                },
                                cornerMarker: {
                                    position: 'absolute',
                                    height: 30,
                                    width: 30,
                                },
                            })
