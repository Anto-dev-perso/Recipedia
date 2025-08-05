import React from "react";

export type ParametersContextType = {
    isDarkMode: boolean,
    toggleDarkMode: () => void
}

// Can't se the full context component in here because it is used inside App component
export const DarkModeContext = React.createContext<ParametersContextType>({
    isDarkMode: false,
    toggleDarkMode: async () => {
    }
});
