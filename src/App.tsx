import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import Home from './pages/Home/Home';
import ViewHike from './pages/ViewHike/ViewHike';
import EditHike from './pages/EditHike/EditHike';
import Preferences from './pages/Preferences/Preferences';
import Sessions from './pages/Sessions/Sessions';
import Users from './pages/Users/Users';
import EditUser from './pages/EditUser/EditUser';
import DeletedHikes from './pages/DeletedHikes/DeletedHikes';
import Login from './pages/Login/Login';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import * as Constants from './constants/constants';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'row',
    },

    leftColumn: {
        width: '20%',

        [theme.breakpoints.down(Constants.HOME_PAGE_SECOND_BREAKPOINT)]: {
            width: '8%'
        }
    },

    contentColumn: {
        marginBottom: '30px',
        marginTop: '30px',
        width: '60%',

        [theme.breakpoints.down(Constants.HOME_PAGE_SECOND_BREAKPOINT)]: {
            width: '84%'
        }
    },

    rightColumn: {
        width: '20%',

        [theme.breakpoints.down(Constants.HOME_PAGE_SECOND_BREAKPOINT)]: {
            width: '8%'
        }
    }
}));

function App() {
    const { classes, cx } = useStyles();

    return (
        <BrowserRouter>
            <Header />

            <Box className={cx(classes.mainContainer)}>
                <Box className={cx(classes.leftColumn)} />

                <Box className={cx(classes.contentColumn)}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/hike' element={<EditHike />} />
                        <Route path='/hike/:hikeId' element={<ViewHike />} />
                        <Route path='/hike/:hikeId/edit' element={<EditHike />} />
                        <Route path='/preferences' element={<Preferences />} />
                        <Route path='/admin/session' element={<Sessions />} />
                        <Route path='/admin/user' element={<Users />} />
                        <Route path='/admin/user/:userId' element={<EditUser />} />
                        <Route path='/admin/user/add' element={<EditUser />} />
                        <Route path='/admin/deleted-hikes' element={<DeletedHikes />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='*' element={<ErrorPage />} />
                    </Routes>
                </Box>

                <Box className={cx(classes.rightColumn)} />
            </Box>
        </BrowserRouter>
    );
}

export default App;
