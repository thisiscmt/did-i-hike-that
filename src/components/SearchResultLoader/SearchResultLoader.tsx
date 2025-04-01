import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        borderRadius: '6px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        display: 'flex',
        gap: '40px',
        padding: '16px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',

        // Adjustments for making the image be above the other content
        [theme.breakpoints.down(600)]: {
            flexDirection: 'column',
            gap: '18px'
        }
    },

    infoLoaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 2,
        gap: '8px'
    },

    hikerLoaderContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '8px',
        marginTop: '8px'
    },

    hikerLoader: {
        borderRadius: '20px'
    }
}));

const SearchResultLoader = () => {
    const { classes, cx } = useStyles();

    return (
        <Box className={cx(classes.mainContainer)}>
            <Skeleton variant='rectangular' height='180px' width='250px' />

            <Box className={cx(classes.infoLoaderContainer)}>
                <Skeleton variant='rectangular' height='20px' width='70%' />
                <Skeleton variant='rectangular' height='20px' width='70%' />

                <Box className={cx(classes.hikerLoaderContainer)}>
                    {
                        [1, 2, 3].map((item: number) => {
                            return (
                                <Skeleton key={item} variant='rectangular' height='33px' width='60px' className={cx(classes.hikerLoader)} />
                            )
                        })
                    }
                </Box>

                <Skeleton variant='rectangular' height='50px' width='100%' />
            </Box>
        </Box>
    );
}

export default SearchResultLoader;
