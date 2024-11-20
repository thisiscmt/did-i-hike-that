import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

import { Hike } from '../models/models';
import * as Constants from '../constants/constants';
import Axios from 'axios';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchText: string;
    searchResults: Hike[] | undefined;
    pageCount: number;
    currentHike: Hike | null;
    isLoggedIn: () => boolean;
    handleException: (error: unknown, msg?: string, msgMap?: MessageMap) => void;
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

export type MessageMap = Record<string, { message: string, severity: AlertSeverity }>;

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
                    errorMsg = error.response?.status ? msgMap[error.response?.status.toString()].message : defaultMsg;
                    severity = error.response?.status ? msgMap[error.response?.status.toString()].severity : 'error';
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
