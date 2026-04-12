import React, {useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Menu, MenuItem, Alert, Button, Fade, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import { MenuOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import MobileMenu from '../MobileMenu/MobileMenu';
import { Colors } from '../../services/themeService';
import { MainContext } from '../../contexts/MainContext';
import * as Constants from '../../constants/constants';
import * as DataService from '../../services/dataService';

const useStyles = makeStyles()((theme) => ({
    headerContainer: {
        backgroundColor: `${Colors.backgroundGray}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',

        [theme.breakpoints.down(630)]: {
            paddingLeft: '10px',
            paddingRight: '15px',
        }
    },

    headerText: {
        marginRight: '16px',
        textDecoration: 'none',

        [theme.breakpoints.down(431)]: {
            fontSize: '1.0rem'
        },
    },

    headerButton: {
        [theme.breakpoints.down(820)]: {
            display: 'none'
        }
    },

    actionSection: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 'auto',
    },

    userDetails: {
        display: 'flex',
        alignItems: 'center',

        [theme.breakpoints.down(820)]: {
            display: 'none'
        }
    },

    fullName: {
        marginLeft: '8px',
        marginRight: '16px'
    },

    mobileMenuButton: {
        display: 'none',

        [theme.breakpoints.down(820)]: {
            display: 'inline-flex',
            marginRight: '10px',
            paddingLeft: 0
        }
    },
}));

const Header = () => {
    const { classes, cx } = useStyles();
    const [ mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const { bannerMessage, bannerSeverity, isLoggedIn, setBanner } = useContext(MainContext);
    const location = useLocation();

    const currentUserFullName = localStorage.getItem(Constants.STORAGE_FULL_NAME) || 'User';
    const currentUserRole = localStorage.getItem(Constants.STORAGE_ROLE);
    const isAdmin = currentUserRole === 'Admin';

    useEffect(() => {
        setBanner('');
    // eslint-disable-next-line
    }, [location]);

    const handleMobileMenuClick = (value: boolean) => {
        setMobileMenuOpen(value);
    };

    const handleAdminMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await DataService.logout();

            localStorage.removeItem(Constants.STORAGE_ROLE);
            localStorage.removeItem(Constants.STORAGE_LAST_LOGIN);
            localStorage.removeItem(Constants.STORAGE_FULL_NAME);

            window.location.href = '/';
        } catch(error) {
            DataService.logError(error);
            setBanner('An error occurred during logout', 'error');
        }
    }

    const adminMenuOpen = Boolean(anchorEl);
    const loggedIn = isLoggedIn();

    return (
        <>
            <header className={cx(classes.headerContainer)}>
                <IconButton
                    aria-label="mobile menu"
                    className={cx(classes.mobileMenuButton)}
                    onClick={() => handleMobileMenuClick(!mobileMenuOpen)}
                >
                    <MenuOutlined />
                </IconButton>

                <SwipeableDrawer
                    anchor='left'
                    open={mobileMenuOpen}
                    onClose={() => handleMobileMenuClick(false)}
                    onOpen={() => handleMobileMenuClick(true)}
                >
                    <MobileMenu onClose={() => handleMobileMenuClick(false)} />
                </SwipeableDrawer>

                <Typography variant='h5' component={Link} to='/' className={cx(classes.headerText)}>Did I Hike That?</Typography>

                <Button variant='text' className={cx(classes.headerButton)} disableRipple={true} component={Link} to='/preferences'>Preferences</Button>

                {
                    isAdmin
                        ?
                            <Box>
                                <Button
                                    id="admin-button"
                                    className={cx(classes.headerButton)}
                                    aria-controls={adminMenuOpen ? 'admin-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={adminMenuOpen ? 'true' : undefined}
                                    onClick={handleAdminMenuClick}
                                    disableRipple={true}
                                >
                                    Admin
                                </Button>

                                <Menu
                                    id="admin-menu"
                                    anchorEl={anchorEl}
                                    open={adminMenuOpen}
                                    onClose={handleAdminMenuClose}
                                    MenuListProps={{ 'aria-labelledby': 'admin-button' }}
                                >
                                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/user">Users</MenuItem>
                                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/session">Sessions</MenuItem>
                                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/deleted-hike">Deleted Hikes</MenuItem>
                                    <MenuItem onClick={handleAdminMenuClose} component={Link} to="/admin/log">System Log</MenuItem>
                                </Menu>
                            </Box>
                        :
                            <></>
                }

                {
                    loggedIn
                        ?
                            <Button variant='text' className={cx(classes.headerButton)} disableRipple={true} onClick={handleLogout}>Logout</Button>
                        :
                            <Button variant='text' className={cx(classes.headerButton)} disableRipple={true} component={Link} to='/login'>Login</Button>
                }


                <div className={cx(classes.actionSection)}>
                    {
                        loggedIn
                            ?
                                <div className={cx(classes.userDetails)}>
                                    <PersonOutlineOutlined color={isAdmin ? 'secondary' : 'primary'} />
                                    <Typography variant='subtitle1' className={cx(classes.fullName)}>{currentUserFullName}</Typography>
                                </div>
                            :
                                null
                    }

                    <Button variant='contained' component={Link} to='/hike' color="primary">Add Hike</Button>
                </div>
            </header>

            {
                bannerMessage &&
                <Fade in={!!bannerMessage}>
                    <Alert severity={bannerSeverity}>{bannerMessage}</Alert>
                </Fade>
            }
        </>
    )
}

export default Header;
