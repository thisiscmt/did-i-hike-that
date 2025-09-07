import React, { useState } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';

import { MainContext, AlertSeverity, MessageMap } from '../contexts/MainContext.tsx';
import { Hike, HikeSearchResults, SearchResultsCache } from '../models/models.ts';
import * as Constants from '../constants/constants';

interface MainProviderProps{
    children: React.ReactNode
}

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
