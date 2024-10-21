import React, { useState } from 'react';
import {Hike} from '../models/models';
import * as Constants from '../constants/constants';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchText: string;
    searchResults: Hike[];
    pageCount: number;
    currentHike: Hike | null;
    loggedIn: boolean;
    setBanner: (message: string, severity?: AlertSeverity) => void;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Hike[]>>;
    setPageCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentHike: React.Dispatch<React.SetStateAction<Hike | null>>;
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
    pageCount: 1,
    currentHike: null,
    loggedIn: false,
    setBanner: () => {},
    setSearchText: () => {},
    setSearchResults: () => {},
    setPageCount: () => {},
    setCurrentHike: () => {},
    setLoggedIn: () => {}
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchResults, setSearchResults ] = useState<Hike[]>([]);
    const [ pageCount, setPageCount ] = useState<number>(1);
    const [ currentHike, setCurrentHike ] = useState<Hike | null>(null);
    const [ loggedIn, setLoggedIn ] = useState<boolean>(!!localStorage.getItem(Constants.STORAGE_LAST_LOGIN));

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
            pageCount,
            currentHike,
            loggedIn,
            setBanner,
            setSearchText,
            setSearchResults,
            setPageCount,
            setCurrentHike,
            setLoggedIn
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
