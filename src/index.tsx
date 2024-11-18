import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';

import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';

import reportWebVitals from './reportWebVitals';
import App from './App';
import { MainProvider } from './contexts/MainContext';
import * as ThemeService from './services/themeService';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <React.StrictMode>
        <ThemeProvider theme={ThemeService.buildTheme()}>
            <MainProvider>
                <App />
            </MainProvider>
        </ThemeProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
