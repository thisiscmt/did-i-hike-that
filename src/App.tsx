import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import {Box} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Preferences from './pages/Preferences/Preferences';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import './App.scss';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftColumn: {
        width: '15%'
    },

    contentColumn: {
        marginBottom: '20px',
        marginTop: '20px',
        width: '70%'
    },

    rightColumn: {
        width: '15%'
    }
}));

function App() {
    const { classes, cx } = useStyles();

    return (
        <main>
            <BrowserRouter>
                <Header />

                <Box className={cx(classes.mainContainer)}>
                    <Box className={cx(classes.leftColumn)} />
                    <Box className={cx(classes.contentColumn)}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/hike/:hikeId" element={<ViewHike />} />
                            <Route path="/hike" element={<EditHike />} />
                            <Route path="/hike/:hikeId/edit" element={<EditHike />} />
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
