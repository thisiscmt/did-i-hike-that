import React from 'react';

import { Hike, HikeSearchResults, SearchResultsCache, SystemError } from '../models/models';

interface MainContextProps {
    bannerMessage: string;
    bannerSeverity: 'error' | 'info' | 'success' | 'warning';
    searchResultsCache: SearchResultsCache;
    currentHike: Hike | null;
    isLoggedIn: () => boolean;
    handleError: (error: unknown, msg?: string) => void;
    normalizeError: (error: unknown) => SystemError;
    setBanner: (message: string, severity?: AlertSeverity) => void;
    storeSearchResults: (hikes: HikeSearchResults, key: string) => void;
    clearSearchResults: () => void;
    setCurrentHike: React.Dispatch<React.SetStateAction<Hike | null>>;
}

export const MainContext = React.createContext<MainContextProps>({
    bannerMessage: '',
    bannerSeverity: 'info',
    searchResultsCache: {},
    currentHike: null,
    isLoggedIn: () => false,
    handleError: () => {},
    normalizeError: () => { return {message: ''} },
    setBanner: () => {},
    storeSearchResults: () => {},
    clearSearchResults: () => {},
    setCurrentHike: () => {},
});

export type AlertSeverity = 'error' | 'info' | 'success' | 'warning';

export type MessageMap = Record<string, { message: string, severity: AlertSeverity }>;

