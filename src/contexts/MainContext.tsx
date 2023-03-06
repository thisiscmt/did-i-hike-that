import React, { useState } from 'react';
import {Hike} from '../models/models';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    setBanner: (message: string, severity?: AlertSeverity) => void;
    searchText: string;
    searchResults: Hike[];
    updatedHike: Hike | null;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Hike[]>>;
    setUpdatedHike: React.Dispatch<React.SetStateAction<Hike | null>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    bannerSeverity: 'info',
    setBanner: (message, severity) => {},
    searchText: '',
    searchResults: [],
    updatedHike: null,
    setSearchText: () => {},
    setSearchResults: () => {},
    setUpdatedHike: () => {}
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchResults, setSearchResults ] = useState<Hike[]>([]);
    const [ updatedHike, setUpdatedHike ] = useState<Hike | null>(null);

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
            searchResults,
            updatedHike,
            setSearchText,
            setSearchResults,
            setUpdatedHike
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
