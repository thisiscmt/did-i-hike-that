import React, { useState } from 'react';
import {Hike} from '../models/models';

interface MainContextProps {
    searchText: string;
    hikes: Hike[];
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setHikes: React.Dispatch<React.SetStateAction<Hike[]>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    searchText: '',
    hikes: [],
    setSearchText: () => {},
    setHikes: () => {}
});

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ searchText, setSearchText ] = useState<string>('');
    const [ hikes, setHikes ] = useState<Hike[]>([]);

    return (
        <MainContext.Provider value={{ searchText, hikes, setSearchText, setHikes }}>
            {children}
        </MainContext.Provider>
    );
};
