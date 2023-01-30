import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Alert, Button, Fade, IconButton, SwipeableDrawer, Typography} from '@mui/material';
import {MenuOutlined} from '@mui/icons-material';
import {makeStyles} from 'tss-react/mui';

import MobileMenu from '../MobileMenu/MobileMenu';
import {Colors} from '../../services/themeService';
import {MainContext} from '../../contexts/MainContext';

const useStyles = makeStyles()((theme) => ({
    headerContainer: {
        backgroundColor: `${Colors.backgroundGray}`,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
        paddingLeft: '20px',
        paddingRight: '20px',

        [theme.breakpoints.down(620)]: {
            paddingLeft: '10px',
            paddingRight: '15px',
        }
    },

    headerText: {
        marginRight: '30px',

        [theme.breakpoints.down(620)]: {
            fontSize: '1.0rem',
            marginRight: 0
        },
    },

    headerButton: {
        [theme.breakpoints.down(620)]: {
            display: 'none'
        }
    },

    addButton: {
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
    const { bannerMessage, setBannerMessage, bannerSeverity, setBannerSeverity } = useContext(MainContext);
    const location = useLocation();

    useEffect(() => {
        setBannerMessage('');
        setBannerSeverity('info');
    }, [location]);

    const handleMobileMenuClick = (value: boolean) => {
        setMobileMenuOpen(value);
    };

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

                <Typography variant='h5' className={cx(classes.headerText)}>Did I Hike That?</Typography>

                <Button variant='text' className={cx(classes.headerButton)} component={Link} to='/'>Home</Button>
                <Button variant='text' className={cx(classes.headerButton)} component={Link} to='preferences/'>Preferences</Button>
                <Button component={Link} variant='contained' to='/hike' color="primary" className={cx(classes.addButton)}>Add Hike</Button>
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
