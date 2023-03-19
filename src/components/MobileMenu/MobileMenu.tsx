import React, { FC, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { CloseOutlined, HomeOutlined, SettingsOutlined, LoginOutlined, LogoutOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import { Colors } from '../../services/themeService';
import { MainContext } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import { STORAGE_LAST_LOGIN } from '../../constants/constants';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        height: '100%',
        width: '180px'
    },

    closeButton: {
        float: 'right',
        margin: '2px',
        zIndex: 1000
    },

    menu: {
        '& .MuiListItem-root': {
            borderTop: `2px solid ${Colors.backgroundGray}`
        },

        '& .MuiListItem-root:last-child': {
            borderBottom: `2px solid ${Colors.backgroundGray}`
        },

        '& .MuiListItemIcon-root': {
            minWidth: '36px'
        }
    }
}));

interface MobileMenuProps {
    onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ onClose }) => {
    const { classes, cx } = useStyles();
    const { setBanner, loggedIn, setLoggedIn } = useContext(MainContext);
    const navigate = useNavigate();

    const handleMenuClose = () => {
        onClose();
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

        handleMenuClose();
    };

    return (
        <Box className={cx(classes.mainContainer)}>
            <IconButton
                aria-label='close the menu'
                className={cx(classes.closeButton)}
                onClick={handleMenuClose}
                size='medium'
            >
                <CloseOutlined />
            </IconButton>

            <List className={cx(classes.menu)}>
                <ListItem disablePadding={true}>
                    <ListItemButton to='/' component={Link} onClick={handleMenuClose}>
                        <ListItemIcon><HomeOutlined /></ListItemIcon>
                        <ListItemText primary='Home' />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding={true}>
                    <ListItemButton to='/preferences' component={Link} onClick={handleMenuClose}>
                        <ListItemIcon><SettingsOutlined /></ListItemIcon>
                        <ListItemText primary='Preferences' />
                    </ListItemButton>
                </ListItem>

                {
                    loggedIn
                        ?
                            <ListItem disablePadding={true}>
                                <ListItemButton onClick={handleLogout}>
                                    <ListItemIcon><LogoutOutlined /></ListItemIcon>
                                    <ListItemText primary='Logout' />
                                </ListItemButton>
                            </ListItem>
                        :
                            <ListItem disablePadding={true}>
                                <ListItemButton to='/login' component={Link} onClick={handleMenuClose}>
                                    <ListItemIcon><LoginOutlined /></ListItemIcon>
                                    <ListItemText primary='Login' />
                                </ListItemButton>
                            </ListItem>
                }
            </List>
        </Box>
    );
}

export default MobileMenu;
