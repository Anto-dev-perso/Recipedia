import {Button, Text, View} from "react-native";
import React from "react";
import {HorizontalListProps} from "@components/molecules/HorizontalList";
import {StackScreenNavigation, StackScreenParamList} from "@customTypes/ScreenTypes";
import {
    EventListenerCallback,
    EventMapCore,
    NavigationProp,
    NavigationState,
    ParamListBase,
    PartialState
} from "@react-navigation/native";

let cptTagPress = 0;
let cptImgPress = 0;

export function horizontalListMock(horizontalListProps: HorizontalListProps) {

    const mockScreenNavigation: StackScreenNavigation = {
        dispatch: function (action: Readonly<{
            type: string;
            payload?: object;
            source?: string;
            target?: string;
        }> | ((state: Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>) => Readonly<{
            type: string;
            payload?: object;
            source?: string;
            target?: string;
        }>)): void {
            throw new Error("Function not implemented.");
        },
        navigate: function <RouteName extends keyof StackScreenParamList>(...args: RouteName extends unknown ? undefined extends StackScreenParamList[RouteName] ? [screen: RouteName] | [screen: RouteName, params: StackScreenParamList[RouteName]] : [screen: RouteName, params: StackScreenParamList[RouteName]] : never): void {
            throw new Error("Function not implemented.");
        },
        reset: function (state: Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }> | PartialState<Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>>): void {
            throw new Error("Function not implemented.");
        },
        goBack: function (): void {
            throw new Error("Function not implemented.");
        },
        isFocused: function (): boolean {
            throw new Error("Function not implemented.");
        },
        canGoBack: function (): boolean {
            throw new Error("Function not implemented.");
        },
        getId: function (): string | undefined {
            throw new Error("Function not implemented.");
        },
        getState: function (): Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }> {
            throw new Error("Function not implemented.");
        },
        getParent: function <T = NavigationProp<ParamListBase, string, undefined, Readonly<{
            key: string;
            index: number;
            routeNames: string[];
            history?: unknown[];
            routes: (Readonly<{ key: string; name: string; path?: string; }> & Readonly<{
                params?: Readonly<object | undefined>;
            }> & { state?: NavigationState | PartialState<NavigationState>; })[];
            type: string;
            stale: false;
        }>, {}, {}> | undefined>(id?: undefined): T {
            throw new Error("Function not implemented.");
        },
        setParams: function (params: Partial<any> | undefined): void {
            throw new Error("Function not implemented.");
        },
        setOptions: function (options: Partial<{}>): void {
            throw new Error("Function not implemented.");
        },
        addListener: function <EventName extends keyof EventMapCore<Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>>>(type: EventName, callback: EventListenerCallback<EventMapCore<Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>>, EventName>): () => void {
            throw new Error("Function not implemented.");
        },
        removeListener: function <EventName extends keyof EventMapCore<Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>>>(type: EventName, callback: EventListenerCallback<EventMapCore<Readonly<{
            key: string;
            index: number;
            routeNames: (keyof StackScreenParamList)[];
            history?: unknown[];
            routes: (Readonly<{
                key: string;
                name: keyof StackScreenParamList;
                path?: string;
            }> & Readonly<{ params?: Readonly<any> | undefined; }> & {
                state?: NavigationState | PartialState<NavigationState>;
            })[];
            type: string;
            stale: false;
        }>>, EventName>): void {
            throw new Error("Function not implemented.");
        }
    };

    return (
        <View>
            <Text testID="HorizontalList::PropType">
                {JSON.stringify(horizontalListProps.propType)}
            </Text>
            <Text testID="HorizontalList::Item">
                {JSON.stringify(horizontalListProps.item)}
            </Text>
            {horizontalListProps.propType == "Tag" ?
                <View>
                    <Text testID="HorizontalList::Icon">
                        {JSON.stringify(horizontalListProps.icon?.name)}
                    </Text>
                    <Text testID="HorizontalList::EditText">
                        {JSON.stringify(horizontalListProps.editText)}
                    </Text>
                    <Button testID="HorizontalList::OnTagPress"
                            onPress={() => {
                                horizontalListProps.onTagPress(horizontalListProps.item[cptTagPress]);
                                cptTagPress++;
                            }}
                            title="Click on Tag"/>
                </View>
                : <Button testID="HorizontalList::OnImgPress"
                          onPress={() => {
                              horizontalListProps.onImgPress(horizontalListProps.item[cptImgPress], mockScreenNavigation);
                          }}
                          title="Click on Tag"/>}
        </View>
    );
}
