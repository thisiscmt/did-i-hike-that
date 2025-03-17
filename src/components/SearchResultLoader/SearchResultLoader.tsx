import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        backgroundColor: 'rgb(255, 255, 255)',
        borderRadius: '6px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        display: 'flex',
        gap: '40px',
        padding: '16px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
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
    },

    nameLoader: {
        width: '50%',

        [theme.breakpoints.down(600)]: {
            width: '100%'
        }
    },

    dateLoader: {
        width: '30%',

        [theme.breakpoints.down(600)]: {
            width: '100%'
        }
    }
}));

const SearchResultLoader = () => {
    const { classes, cx } = useStyles();

    return (
        <Box className={cx(classes.mainContainer)}>
            <Skeleton variant='rectangular' height='180px' width='250px' />

            <Box className={cx(classes.infoLoaderContainer)}>
                <Skeleton variant='rectangular' height='20px' className={cx(classes.nameLoader)} />
                <Skeleton variant='rectangular' height='20px' className={cx(classes.dateLoader)} />

                <Box className={cx(classes.hikerLoaderContainer)}>
                    {
                        [1, 2, 3].map((item: number) => {
                            return (
                                <Skeleton key={item} variant='rectangular' height='30px' width='60px' className={cx(classes.hikerLoader)} />
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
