import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Hike } from '../models/models';
import * as Constants from '../constants/constants';
import Axios, {AxiosError} from 'axios';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchText: string;
    searchResults: Hike[] | undefined;
    pageCount: number;
    currentHike: Hike | null;
    isLoggedIn: () => boolean;
    handleException: (error: unknown, msg?: string) => void;
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
    isLoggedIn: () => false,
    handleException: () => {},
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
        return !!localStorage.getItem(Constants.STORAGE_EMAIL) &&
            !!localStorage.getItem(Constants.STORAGE_ROLE) &&
            !!localStorage.getItem(Constants.STORAGE_LAST_LOGIN) &&
            !!cookies[Constants.SESSION_COOKIE];
    }

    const setBanner = (message: string, severity?: AlertSeverity) => {
        setBannerMessage(message);
        setBannerSeverity(severity || 'info');
    };

    const handleException = (error: unknown, msg?: string) => {
        if (Axios.isAxiosError(error)) {
            if (error.response?.status === 403) {
                setBanner('You are not authorized to access this content', 'error');
            } else {
                setBanner(msg ? msg : (error as AxiosError).message, 'error');
            }
        } else if (error instanceof Error) {
            setBanner(msg ? msg : (error as Error).message, 'error');
        } else {
            setBanner(msg ? msg : 'An error occurred during the request', 'error');
        }
    };

    return (
        <MainContext.Provider value={{
            bannerMessage,
            bannerSeverity,
            searchText,
            searchResults,
            pageCount,
            currentHike,
            isLoggedIn,
            handleException,
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
