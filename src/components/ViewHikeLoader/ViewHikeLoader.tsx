import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '24px'
    },

    infoLoaderContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '6px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        rowGap: '14px',
        padding: '16px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    },

    infoLoader: {
        columnGap: '24px',
        display: 'flex',
        rowGap: '14px'
    },

    hikerLoaderContainer: {
        alignItems: 'center',
        display: 'flex',
        gap: '16px'
    },

    hikerLoader: {
        borderRadius: '20px'
    }
}));

const ViewHikeLoader = () => {
    const { classes, cx } = useStyles();

    return (
        <Box className={cx(classes.mainContainer)}>
            <Skeleton variant='rectangular' height='40px' width='50%' />

            <Box className={cx(classes.infoLoaderContainer)}>
                {
                    [1, 2, 3].map((item: number) => {
                        return (
                            <Box key={item} className={cx(classes.infoLoader)}>
                                <Skeleton variant='rectangular' height='20px' width='90px' />
                                <Skeleton variant='rectangular' height='20px' width='200px' />
                            </Box>
                        )
                    })
                }
            </Box>

            <Box className={cx(classes.infoLoaderContainer)}>
                <Skeleton variant='rectangular' height='50px' width='100%' />
                <Skeleton variant='rectangular' height='50px' width='100%' />
            </Box>

            <Box className={cx(classes.hikerLoaderContainer)}>
                {
                    [1, 2, 3].map((item: number) => {
                        return (
                            <Skeleton key={item} variant='rectangular' height='33px' width='60px' className={cx(classes.hikerLoader)} />
                        )
                    })
                }
            </Box>

            <Skeleton variant='rectangular' height='200px' width='100%' />
        </Box>
    );
}

export default ViewHikeLoader;
