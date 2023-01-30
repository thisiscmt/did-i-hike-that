import React, {useContext, useLayoutEffect, useRef} from 'react';
import {BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';
import {Box} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Preferences from './pages/Preferences/Preferences';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import {MainContext} from './contexts/MainContext';
import './App.scss';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftColumn: {
        width: '15%'
    },

    contentColumn: {
        marginBottom: '40px',
        marginTop: '30px',
        width: '70%'
    },

    rightColumn: {
        width: '15%'
    }
}));

function App() {
    const { classes, cx } = useStyles();
    const { setBannerMessage, setBannerSeverity } = useContext(MainContext);

    // This ref is used by child components to scroll to the top of the page, if needed
    const topOfPageRef = useRef<HTMLElement>(null);

    return (
        <main ref={topOfPageRef}>
            <BrowserRouter>
                <Header />

                <Box className={cx(classes.mainContainer)}>
                    <Box className={cx(classes.leftColumn)} />
                    <Box className={cx(classes.contentColumn)}>


                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/hike" element={<EditHike topOfPageRef={topOfPageRef} />} />
                            <Route path="/hike/:hikeId" element={<ViewHike />} />
                            <Route path="/hike/:hikeId/edit" element={<EditHike topOfPageRef={topOfPageRef} />} />
                            <Route path="/preferences" element={<Preferences />} />
                            <Route path="*" element={<ErrorPage />} />
                        </Routes>
                    </Box>
                    <Box className={cx(classes.rightColumn)} />
                </Box>
            </BrowserRouter>
        </main>
    );
}

export default App;
