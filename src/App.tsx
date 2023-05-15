import React, { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Preferences from './pages/Preferences/Preferences';
import Login from './pages/Login/Login';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import './App.scss';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftColumn: {
        width: '20%',

        [theme.breakpoints.down(700)]: {
            width: '8%'
        }
    },

    contentColumn: {
        marginBottom: '30px',
        marginTop: '30px',
        width: '60%',

        [theme.breakpoints.down(700)]: {
            width: '84%'
        }
    },

    rightColumn: {
        width: '20%',

        [theme.breakpoints.down(700)]: {
            width: '8%'
        }
    }
}));

function App() {
    const { classes, cx } = useStyles();

    // TODO: Add code to deal with a switch from offline to online mode

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
                            <Route path="/hike/:hikeId" element={<ViewHike topOfPageRef={topOfPageRef} />} />
                            <Route path="/hike/:hikeId/edit" element={<EditHike topOfPageRef={topOfPageRef} />} />
                            <Route path="/preferences" element={<Preferences />} />
                            <Route path="/login" element={<Login />} />
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
