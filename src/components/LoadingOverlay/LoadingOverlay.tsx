import React, {FC} from 'react';
import { makeStyles } from 'tss-react/mui';
import {Backdrop, CircularProgress} from '@mui/material';

const useStyles = makeStyles()(() => ({
    backdrop: {
        position: 'absolute',
        zIndex: 100
    },

    progressIndicator: {
        color: '#ffffff'
    }
}));

interface LoadingOverlayProps {
    open: boolean;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ open }) => {
    const { classes, cx } = useStyles();

    return (
        <Backdrop open={open} className={cx(classes.backdrop)} style={{ opacity: '0.6' }}>
            <CircularProgress className={cx(classes.progressIndicator)} />
        </Backdrop>
    );
};

export default LoadingOverlay
