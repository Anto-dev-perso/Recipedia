export function gestureHandlerMock() {
    const View = require('react-native').View;
    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        GestureHandlerRootView: View,
        TapGestureHandler: View,
        PanGestureHandler: View,
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        ToolbarAndroid: View,
        ViewPagerAndroid: View,
        WebView: View,
        NativeViewGestureHandler: View,
        FlatList: View,
        gestureHandlerRootHOC: jest.fn((Component) => Component),
        Directions: {},
    };
}
