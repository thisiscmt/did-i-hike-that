import React from 'react';
import { Box, Skeleton } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        borderRadius: '6px',
        boxShadow: 'rgba(0, 0, 0, 0.2) 0px 3px 1px -2px, rgba(0, 0, 0, 0.14) 0px 2px 2px 0px, rgba(0, 0, 0, 0.12) 0px 1px 5px 0px',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        rowGap: '24px',
        transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)'
    },

    headerLoader: {
        display: 'flex',
        marginBottom: '12px'
    },

    tableBodyLoaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '20px'
    },

    tableRowLoaderContainer: {
        display: 'flex',
        columnGap: '16px',
        justifyContent: 'space-between'
    }
}));

const TableLoader = () => {
    const { classes, cx } = useStyles();

    return (
        <>
            <Box className={cx(classes.headerLoader)}>
                <Skeleton variant='rectangular' height='36px' width='150px' />
            </Box>

            <Box className={cx(classes.mainContainer)}>
                <Box className={cx(classes.tableRowLoaderContainer)}>
                    <Skeleton variant='rectangular' height='24px' width='200px' />
                    <Skeleton variant='rectangular' height='24px' width='200px' />
                    <Skeleton variant='rectangular' height='24px' width='200px' />
                    <Skeleton variant='rectangular' height='24px' width='200px' />
                </Box>

                <Box className={cx(classes.tableBodyLoaderContainer)}>
                    {
                        [1, 2, 3, 4, 5].map((item: number) => {
                            return (
                                <Box className={cx(classes.tableRowLoaderContainer)} key={item}>
                                    <Skeleton key={item} variant='rectangular' height='24px' width='200px' />
                                    <Skeleton key={item} variant='rectangular' height='24px' width='200px' />
                                    <Skeleton key={item} variant='rectangular' height='24px' width='200px' />
                                    <Skeleton key={item} variant='rectangular' height='24px' width='200px' />
                                </Box>
                            );
                        })
                    }
                </Box>
            </Box>
        </>
    );
}

export default TableLoader;
