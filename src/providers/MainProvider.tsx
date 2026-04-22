import React, { useState } from 'react';
import Axios from 'axios';
import { useCookies } from 'react-cookie';

import { MainContext, AlertSeverity, MessageMap } from '../contexts/MainContext.tsx';
import { Hike, HikeSearchResults, SearchResultsCache, SystemError } from '../models/models.ts';
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

    const clearSearchResults = () => {
        setSearchResultsCache({});
    };

    const handleError = (error: unknown, msg?: string) => {
        const systemError = normalizeError(error);
        const defaultMsg = 'An error occurred during the request';
        let errorMsg: string;
        let severity: AlertSeverity = 'error';

        if (systemError.message) {
            errorMsg = systemError.message;
        } else if (systemError.code && systemError.code === 'ERR_CANCELED') {
            errorMsg = 'The operation was cancelled';
            severity = 'warning';
        } else if (systemError.data) {
            errorMsg = systemError.data;
        } else if (msg) {
            errorMsg = msg;
        } else {
            errorMsg = defaultMsg;
        }

        setBanner(errorMsg, severity);
    };

    const normalizeError = (error: unknown): SystemError => {
        const systemError: SystemError = {
            message: ''
        };

        if (Axios.isAxiosError(error)) {
            systemError.message = error.message;
            systemError.code = error.code;
            systemError.status = error.response?.status;
            systemError.statusText = error.response?.statusText;
            systemError.data = error.response?.data;

            if (error.status === 403) {
                systemError.message = 'You are not authorized to view this page';
            }
        } else if (error instanceof Error) {
            systemError.message = error.message;
        }

        return systemError;
    };

    return (
        <MainContext.Provider value={{
            bannerMessage,
            bannerSeverity,
            searchResultsCache,
            currentHike,
            isLoggedIn,
            handleError,
            normalizeError,
            setBanner,
            storeSearchResults,
            clearSearchResults,
            setCurrentHike,
        }}
        >
            {children}
        </MainContext.Provider>
    );
};
