export const mockNavigate = jest.fn();

export function reactNavigationMock() {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useNavigation: () => ({
            navigate: mockNavigate,
        }),
    };
}
