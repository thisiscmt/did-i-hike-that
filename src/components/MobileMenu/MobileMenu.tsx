import React, { FC, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { CloseOutlined, HomeOutlined, LoginOutlined, LogoutOutlined, SettingsOutlined, AdminPanelSettingsOutlined, PeopleAltOutlined, Groups3Outlined,
    DeleteSweepOutlined, LibraryBooksOutlined, ExpandLess, ExpandMore } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import { Colors } from '../../services/themeService';
import { MainContext } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as Constants from '../../constants/constants';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        height: '100%',
        width: '200px'
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
    },

    submenuItem: {
        paddingLeft: '32px'
    }
}));

interface MobileMenuProps {
    onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ onClose }) => {
    const { classes, cx } = useStyles();
    const [ adminMenuOpen, setAdminMenuOpen] = useState<boolean>(true);
    const { setBanner, isLoggedIn } = useContext(MainContext);
    const navigate = useNavigate();

    const currentUserRole = localStorage.getItem(Constants.STORAGE_ROLE);
    const isAdmin = currentUserRole === 'Admin';

    const handleMenuClose = () => {
        onClose();
    };

    const handleAdminMenuClose = () => {
        setAdminMenuOpen(!adminMenuOpen);
    };

    const handleLogout = async () => {
        try {
            await DataService.logout();
            localStorage.removeItem(Constants.STORAGE_LAST_LOGIN);
            navigate('/');
        } catch(error) {
            DataService.logError(error);
            setBanner('An error occurred during logout', 'error');
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
                    <ListItemButton component={Link} to='/preferences' onClick={handleMenuClose}>
                        <ListItemIcon><SettingsOutlined /></ListItemIcon>
                        <ListItemText primary='Preferences' />
                    </ListItemButton>
                </ListItem>

                {
                    isAdmin
                        ?
                            <>
                                <ListItemButton onClick={handleAdminMenuClose} disableRipple={true}>
                                    <ListItemIcon><AdminPanelSettingsOutlined /></ListItemIcon>
                                    <ListItemText primary="Admin" />
                                    { adminMenuOpen ? <ExpandLess /> : <ExpandMore /> }
                                </ListItemButton>

                                <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        <ListItemButton className={cx(classes.submenuItem)} onClick={handleMenuClose} component={Link} to='/admin/user'>
                                            <ListItemIcon><PeopleAltOutlined /></ListItemIcon>
                                            <ListItemText primary="Users" />
                                        </ListItemButton>
                                        <ListItemButton className={cx(classes.submenuItem)} onClick={handleMenuClose} component={Link} to='/admin/session'>
                                            <ListItemIcon><Groups3Outlined /></ListItemIcon>
                                            <ListItemText primary="Sessions" />
                                        </ListItemButton>
                                        <ListItemButton className={cx(classes.submenuItem)} onClick={handleMenuClose} component={Link} to='/admin/deleted-hike'>
                                            <ListItemIcon><DeleteSweepOutlined /></ListItemIcon>
                                            <ListItemText primary="Deleted Hikes" />
                                        </ListItemButton>
                                        <ListItemButton className={cx(classes.submenuItem)} onClick={handleMenuClose} component={Link} to='/admin/log'>
                                            <ListItemIcon><LibraryBooksOutlined /></ListItemIcon>
                                            <ListItemText primary="System Log" />
                                        </ListItemButton>
                                    </List>
                                </Collapse>
                            </>
                        :
                            <></>
                }

                {
                    isLoggedIn()
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
