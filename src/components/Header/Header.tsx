import React, {useContext, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, Button, Fade, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import { MenuOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import MobileMenu from '../MobileMenu/MobileMenu';
import { Colors } from '../../services/themeService';
import { MainContext } from '../../contexts/MainContext';
import { STORAGE_LAST_LOGIN } from '../../constants/constants';
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
        marginRight: '30px',
        textDecoration: 'none',

        [theme.breakpoints.down(630)]: {
            fontSize: '1.0rem',
            marginRight: 0
        },
    },

    headerButton: {
        [theme.breakpoints.down(630)]: {
            display: 'none'
        }
    },

    addHikeButton: {
        marginLeft: 'auto',
    },

    mobileMenuButton: {
        display: 'none',

        [theme.breakpoints.down('md')]: {
            display: 'inline-flex',
            marginRight: '10px'
        }
    },
}));

const Header = () => {
    const { classes, cx } = useStyles();
    const [ mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const { bannerMessage, bannerSeverity, loggedIn, setBanner, setLoggedIn } = useContext(MainContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        setBanner('');
    // eslint-disable-next-line
    }, [location]);

    const handleMobileMenuClick = (value: boolean) => {
        setMobileMenuOpen(value);
    };

    const handleLogout = async () => {
        try {
            await DataService.logout();

            localStorage.removeItem(STORAGE_LAST_LOGIN);
            setLoggedIn(false);
            navigate('/');
        } catch(error) {
            setBanner('Error occurred during logout', 'error');
        }
    }

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

                {/*TODO*/}
                {/*<Button variant='text' className={cx(classes.headerButton)} component={Link} to='/preferences'>Preferences</Button>*/}

                {
                    loggedIn
                        ?
                            <Button variant='text' className={cx(classes.headerButton)} onClick={handleLogout}>Logout</Button>
                        :
                            <Button variant='text' className={cx(classes.headerButton)} component={Link} to='/login'>Login</Button>
                }

                <Button variant='contained' className={cx(classes.addHikeButton)} component={Link} to='/hike' color="primary">Add Hike</Button>
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
