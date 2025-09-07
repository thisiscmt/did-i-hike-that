import React from 'react';

import { Hike, HikeSearchResults, SearchResultsCache } from '../models/models';

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

