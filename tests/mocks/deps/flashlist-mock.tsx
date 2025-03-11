export function flashListMock() {
    const React = require('react');
    return {
        FlashList: (props: any) => {
            // Render items as if it's a simple list
            return <>{props.data.map((item: any, index: number) => props.renderItem({item, index}))}</>;
        }
    };
}
