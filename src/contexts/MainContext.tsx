import React, { useState } from 'react';

interface MainContextProps {
    searchText: string;
    setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

interface MainProviderProps{
    children: React.ReactNode
}

export const MainContext = React.createContext<MainContextProps>({
    searchText: '',
    setSearchText: () => {}
});

export const MainProvider = ({ children }: MainProviderProps) => {
    const [ searchText, setSearchText ] = useState<string>('');

    return (
        <MainContext.Provider value={{ searchText, setSearchText }}>
            {children}
        </MainContext.Provider>
    );
};
