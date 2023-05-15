import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Backdrop, Box, Typography } from '@mui/material';
import { OfflineBoltOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import {STORAGE_OFFLINE} from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    backdrop: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'flex-start',
        zIndex: theme.zIndex.drawer + 1
    },

    content: {
        backgroundColor: 'white',
        borderRadius: '8px',
        cursor: 'pointer',
        marginLeft: '24px',
        marginRight: '24px',
        marginTop: '80px',
        padding: '15px 20px',
        zIndex: theme.zIndex.drawer + 2
    },

    contentHeader: {
        alignItems: 'center',
        display: 'flex',
        marginBottom: '8px',

        '& svg': {
            marginRight: '12px'
        },

        '& .MuiTypography-root': {
            fontWeight: 'bold'
        }
    },

    contentText: {
        marginBottom: '12px'
    }
}));

export const Offline = (props: PropsWithChildren) => {
    const { classes, cx } = useStyles();
    const [ offline, setOffline ] = useState<boolean>(false);
    const [ backdropOpen, setBackdropOpen ] = useState<boolean>(false);

    const handleOnline = () => {
        console.log('inside handleOnline');

        setOffline(false);
        setBackdropOpen(false);
        sessionStorage.setItem(STORAGE_OFFLINE, 'false');
    };

    const handleOffline = () => {
        console.log('inside handleOffline');

        setOffline(true);
        setBackdropOpen(true);
        sessionStorage.setItem(STORAGE_OFFLINE, 'true');
    };

    const handleCloseBackdrop = () => {
        setBackdropOpen(false);
    }

    useEffect(() => {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <>
            {
                offline &&
                <>
                    <Backdrop open={backdropOpen} className={cx(classes.backdrop)}>
                        <Box className={cx(classes.content)} onClick={handleCloseBackdrop}>
                            <Box className={cx(classes.contentHeader)}>
                                <OfflineBoltOutlined fontSize='large' color='error' />
                                <Typography variant='body1'>It looks like you are offline.</Typography>
                            </Box>

                            <Typography variant='body2' className={cx(classes.contentText)}>No worries, any changes you make will be saved and applied
                                when you get back online.</Typography>
                            <Typography variant='body2'>Click here to continue.</Typography>
                        </Box>
                    </Backdrop>
                </>
            }

            {props.children}
        </>
    );
};

export default Offline;
