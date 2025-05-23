import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Hike, HikeSearchResults, SearchResultsCache } from '../models/models';
import * as Constants from '../constants/constants';
import Axios from 'axios';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchResultsCache: SearchResultsCache;
    currentHike: Hike | null;
    isLoggedIn: () => boolean;
    handleException: (error: unknown, msg?: string, msgMap?: MessageMap) => void;
    setBanner: (message: string, severity?: AlertSeverity) => void;
    storeSearchResults: (hikes: HikeSearchResults, key: string) => void;
    setCurrentHike: React.Dispatch<React.SetStateAction<Hike | null>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    bannerSeverity: 'info',
    searchResultsCache: {},
    currentHike: null,
    isLoggedIn: () => false,
    handleException: () => {},
    setBanner: () => {},
    storeSearchResults: () => {},
    setCurrentHike: () => {},
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export type MessageMap = Record<string, { message: string, severity: AlertSeverity }>;

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ bannerMessage, setBannerMessage ] = useState<string>('');
    const [ bannerSeverity, setBannerSeverity ] = useState<AlertSeverity>('info');
    const [ searchResultsCache, setSearchResultsCache ] = useState<SearchResultsCache>({});
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

    const storeSearchResults = (hikes: HikeSearchResults, key: string) => {
        const newCache = {...searchResultsCache};
        newCache[key] = hikes;

        setSearchResultsCache(newCache);
    };

    const handleException = (error: unknown, msg?: string, msgMap?: MessageMap) => {
        const defaultMsg = 'An error occurred during the request';
        let errorMsg: string;
        let severity: AlertSeverity = 'error';

        if (Axios.isAxiosError(error)) {
            if (msgMap) {
                if (error.code && error.code === 'ERR_CANCELED') {
                    errorMsg = msgMap[error.code].message;
                    severity = msgMap[error.code].severity;
                } else {
                    errorMsg = error.response?.status && msgMap[error.response?.status.toString()] ? msgMap[error.response?.status.toString()].message : (msg ? msg : defaultMsg);
                    severity = error.response?.status && msgMap[error.response?.status.toString()] ? msgMap[error.response?.status.toString()].severity : 'error';
                }
            } else {
                errorMsg = error.response?.data ? error.response?.data : (msg ? msg : defaultMsg);
            }
        } else if (error instanceof Error) {
            errorMsg = msg ? msg : error.message;
        } else {
            errorMsg = msg ? msg : defaultMsg;
        }

        setBanner(errorMsg, severity);
    };

    return (
        <MainContext.Provider value={{
            bannerMessage,
            bannerSeverity,
            searchResultsCache,
            currentHike,
            isLoggedIn,
            handleException,
            setBanner,
            storeSearchResults,
            setCurrentHike,
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
