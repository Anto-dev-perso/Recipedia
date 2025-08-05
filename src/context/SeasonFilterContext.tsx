import React, {createContext, useContext, useEffect, useState} from 'react';
import {getSeasonFilter, setSeasonFilter} from "@utils/settings";

interface SeasonFilterContextType {
    seasonFilter: boolean;
    setSeasonFilter: () => void;
}

const SeasonFilterContext = createContext<SeasonFilterContextType | undefined>(undefined);

export const useSeasonFilter = () => {
    const context = useContext(SeasonFilterContext);
    if (!context) {
        throw new Error('useSeasonFilter must be used within SeasonFilterProvider');
    }
    return context;
};

export const SeasonFilterProvider = ({children}: { children: React.ReactNode }) => {
    const [seasonFilter, setSeasonFilterState] = useState(true);

    useEffect(() => {
        getSeasonFilter().then((value) => {
            setSeasonFilterState(value);
        });
    }, []);

    const setSeasonFilterContext = () => {
        const newSeasonFilter = !seasonFilter;
        setSeasonFilterState(newSeasonFilter);
        setSeasonFilter(newSeasonFilter);
    };

    return (
        <SeasonFilterContext.Provider value={{seasonFilter, setSeasonFilter: setSeasonFilterContext}}>
            {children}
        </SeasonFilterContext.Provider>
    );
};
