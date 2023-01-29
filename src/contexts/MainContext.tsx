import React, { useState } from 'react';
import {Hike} from '../models/models';

interface MainContextProps {
    bannerMessage: string;
    setBannerMessage: React.Dispatch<React.SetStateAction<string>>;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    setBannerSeverity: React.Dispatch<React.SetStateAction<'error' | 'info' | 'success' | 'warning'>>;
    searchText: string;
    hikes: Hike[];
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setHikes: React.Dispatch<React.SetStateAction<Hike[]>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    setBannerMessage: () => {},
    bannerSeverity: 'info',
    setBannerSeverity: () => {},
    searchText: '',
    hikes: [],
    setSearchText: () => {},
    setHikes: () => {}
});

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<'error' | 'info' | 'success' | 'warning'>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ hikes, setHikes ] = useState<Hike[]>([]);

    return (
        <MainContext.Provider value={{
            bannerMessage,
            setBannerMessage,
            bannerSeverity,
            setBannerSeverity,
            searchText,
            hikes,
            setSearchText,
            setHikes }}
        >
            {children}
        </MainContext.Provider>
    );
};
