import React, { useState } from 'react';
import {Hike} from '../models/models';
import {STORAGE_LAST_LOGIN_KEY} from '../constants/constants';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchText: string;
    searchResults: Hike[];
    updatedHike: Hike | null;
    loggedIn: boolean;
    setBanner: (message: string, severity?: AlertSeverity) => void;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Hike[]>>;
    setUpdatedHike: React.Dispatch<React.SetStateAction<Hike | null>>;
    setLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    bannerSeverity: 'info',
    searchText: '',
    searchResults: [],
    updatedHike: null,
    loggedIn: false,
    setBanner: () => {},
    setSearchText: () => {},
    setSearchResults: () => {},
    setUpdatedHike: () => {},
    setLoggedIn: () => {}
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchResults, setSearchResults ] = useState<Hike[]>([]);
    const [ updatedHike, setUpdatedHike ] = useState<Hike | null>(null);
    const [ loggedIn, setLoggedIn ] = useState<boolean>(!!localStorage.getItem(STORAGE_LAST_LOGIN_KEY));

    const setBanner = (message: string, severity?: AlertSeverity) => {
        setBannerMessage(message);
        setBannerSeverity(severity || 'info');
    };

    return (
        <MainContext.Provider value={{
            bannerMessage,
            bannerSeverity,
            searchText,
            searchResults,
            updatedHike,
            loggedIn,
            setBanner,
            setSearchText,
            setSearchResults,
            setUpdatedHike,
            setLoggedIn
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
