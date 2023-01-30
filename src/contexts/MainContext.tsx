import React, { useState } from 'react';
import {Hike} from '../models/models';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    setBanner: (message: string, severity?: AlertSeverity) => void;
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
    bannerSeverity: 'info',
    setBanner: (message, severity) => {},
    searchText: '',
    hikes: [],
    setSearchText: () => {},
    setHikes: () => {}
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ hikes, setHikes ] = useState<Hike[]>([]);

    const setBanner = (message: string, severity?: AlertSeverity) => {
        setBannerMessage(message);
        setBannerSeverity(severity || 'info');
    };

    return (
        <MainContext.Provider value={{
            bannerMessage,
            bannerSeverity,
            setBanner,
            searchText,
            hikes,
            setSearchText,
            setHikes }}
        >
            {children}
        </MainContext.Provider>
    );
};
