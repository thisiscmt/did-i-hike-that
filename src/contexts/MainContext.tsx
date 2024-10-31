import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Hike } from '../models/models';
import * as Constants from '../constants/constants';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchText: string;
    searchResults: Hike[] | undefined;
    pageCount: number;
    currentHike: Hike | null;
    loggedIn: boolean;
    setBanner: (message: string, severity?: AlertSeverity) => void;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
    setSearchResults: React.Dispatch<React.SetStateAction<Hike[] | undefined>>;
    setPageCount: React.Dispatch<React.SetStateAction<number>>;
    setCurrentHike: React.Dispatch<React.SetStateAction<Hike | null>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    bannerSeverity: 'info',
    searchText: '',
    searchResults: undefined,
    pageCount: 1,
    currentHike: null,
    loggedIn: false,
    setBanner: () => {},
    setSearchText: () => {},
    setSearchResults: () => {},
    setPageCount: () => {},
    setCurrentHike: () => {},
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchText, setSearchText ] = useState<string>('');
    const [ searchResults, setSearchResults ] = useState<Hike[] | undefined>(undefined);
    const [ pageCount, setPageCount ] = useState<number>(1);
    const [ currentHike, setCurrentHike ] = useState<Hike | null>(null);
    const [ cookies ] = useCookies([Constants.SESSION_COOKIE]);

    const isLoggedIn = () => {
        return !!localStorage.getItem(Constants.STORAGE_ROLE) &&
            !!localStorage.getItem(Constants.STORAGE_LAST_LOGIN) &&
            !!localStorage.getItem(Constants.STORAGE_FULL_NAME) &&
            !!cookies[Constants.SESSION_COOKIE];
    }

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
            loggedIn: isLoggedIn(),
            setBanner,
            setSearchText,
            setSearchResults,
            setPageCount,
            setCurrentHike,
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
