import React, {FC} from 'react';
import {Box, IconButton, List, ListItem} from '@mui/material';
import {CloseOutlined} from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import {Colors} from '../../services/sharedService';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        backgroundColor: `${Colors.backgroundGray}`,
        width: '150px'
    },

    closeButton: {
        float: 'right',
        padding: 0,
        margin: '12px 12px 0 0'
    }
}));

interface MobileMenuProps {
    onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ onClose }) => {
    const { classes, cx } = useStyles();

    const handleMenuClose = () => {
        onClose();
    };

    return (
        <Box className={cx(classes.mainContainer)}>
            <IconButton
                aria-label="clear search input"
                className={cx(classes.closeButton)}
                onClick={handleMenuClose}
            >
                <CloseOutlined />
            </IconButton>

            <List>
                <ListItem>Home</ListItem>
                <ListItem>Preferences</ListItem>
            </List>
        </Box>
    );
}

export default MobileMenu;
