import React, { useRef } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Admin from './pages/Admin/Admin';
import EditUser from './pages/EditUser/EditUser';
import Login from './pages/Login/Login';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import {HOME_PAGE_FIRST_BREAKPOINT} from './constants/constants';
import './App.scss';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftColumn: {
        width: '20%',

        [theme.breakpoints.down(HOME_PAGE_FIRST_BREAKPOINT)]: {
            width: '8%'
        }
    },

    contentColumn: {
        marginBottom: '30px',
        marginTop: '30px',
        width: '60%',

        [theme.breakpoints.down(HOME_PAGE_FIRST_BREAKPOINT)]: {
            width: '84%'
        }
    },

    rightColumn: {
        width: '20%',

        [theme.breakpoints.down(HOME_PAGE_FIRST_BREAKPOINT)]: {
            width: '8%'
        }
    }
}));

function App() {
    const { classes, cx } = useStyles();

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
                            <Route path='/' element={<Home />} />
                            <Route path='/hike' element={<EditHike topOfPageRef={topOfPageRef} />} />
                            <Route path='/hike/:hikeId' element={<ViewHike topOfPageRef={topOfPageRef} />} />
                            <Route path='/hike/:hikeId/edit' element={<EditHike topOfPageRef={topOfPageRef} />} />
                            <Route path='/admin' element={<Admin />} />
                            <Route path='/admin/user/:userId?' element={<EditUser topOfPageRef={topOfPageRef} />} />
                            <Route path='/login' element={<Login />} />
                            <Route path='*' element={<ErrorPage />} />
                        </Routes>
                    </Box>

                    <Box className={cx(classes.rightColumn)} />
                </Box>
            </BrowserRouter>
        </main>
    );
}

export default App;
