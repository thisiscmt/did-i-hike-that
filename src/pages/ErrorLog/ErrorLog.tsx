import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { LogEntry } from '../../models/models.ts';
import TableLoader from '../../components/TableLoader/TableLoader.tsx';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Colors, SaveIndicatorStyles } from '../../services/themeService.ts';
import * as DataService from '../../services/dataService.ts';
import * as SharedService from '../../services/sharedService.ts';
import {getDefaultPageSize} from '../../services/sharedService.ts';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },

    cardContent: {
        padding: '8px 12px',

        ':last-Child': {
            paddingBottom: '8px'
        }
    },

    infoLevel: {
        backgroundColor: Colors.infoLogEntry
    },

    warnLevel: {
        backgroundColor: Colors.warnLogEntry
    },

    errorLevel: {
        backgroundColor: Colors.errorLogEntry
    },

    logEntry: {
        summary: {
            cursor: 'pointer',
            transition: 'margin 250ms ease-out'
        },

        ':open': {
            summary: {
                marginBottom: '6px'
            }
        }
    },

    logContent: {
        display: 'inline-flex',
        columnGap: '16px',
        flexWrap: 'wrap',
        rowGap: '4px'
    },

    timestamp: {
        width: '200px'
    },

    level: {
        textTransform: 'capitalize',
        width: '36px'
    },

    service: {
        width: '56px',

        '@media (max-width: 450px)': {
            display: 'none'
        }
    },

    serviceMobile: {
        display: 'none',

        '@media (max-width: 450px)': {
            display: 'block',
            marginTop: '4px'
        }
    },

    message: {
        marginTop: '6px'
    },

    stack: {
        whiteSpace: 'pre-wrap',
        overflowX: 'auto'
    },

    loadMoreButton: {
        marginTop: '12px',
        textAlign: 'center'
    },

    loadIndicator: {
        ...SaveIndicatorStyles
    }
}));

const ErrorLog = () => {
    const { classes } = useStyles();
    const [ logData, setLogData ] = useState<LogEntry[]>([]);
    const [ page, setPage ] = useState<number>(1);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ loadingMore, setLoadingMore ] = useState<boolean>(false);
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const pageSize = SharedService.getDefaultPageSize();

    useDocumentTitle('Error Log - Did I Hike That?');

    useEffect(() => {
        const getLogData = async () => {
            try {
                const response = await DataService.getLogData(page, pageSize);
                setLogData(response);
            } catch (error) {
                // TODO
            } finally {
                setRetrievedData(true);
                setLoading(false);
            }
        }

        if (!retrievedData) {
            getLogData();
        }
    });

    const handleLoadMore = async () => {
        try {
            setLoadingMore(true);

            const newPage = page + 1;
            const response = await DataService.getLogData(newPage, pageSize);

            setLogData(logData.concat(response));
            setPage(newPage);
        } catch (error) {
            // TODO
        } finally {
            setLoadingMore(false);
        }
    };

    return (
        <>
            {
                loading
                    ?
                        <TableLoader />
                    :
                        logData.length > 0
                            ?
                                <Box className={classes.mainContainer}>
                                    {
                                        logData.map((logEntry: LogEntry, index: number) => {
                                            let className = classes.infoLevel;

                                            switch (logEntry.level) {
                                                case 'warn':
                                                    className = classes.warnLevel;
                                                    break;
                                                case 'error':
                                                    className = classes.errorLevel;
                                                    break;
                                            }

                                            return (
                                                <Card key={index}>
                                                    <CardContent className={`${className} ${classes.cardContent}`}>
                                                        <details className={classes.logEntry}>
                                                            <summary>
                                                                <Box className={classes.logContent}>
                                                                    <Box className={classes.timestamp}>
                                                                        {SharedService.formatISODateValue(logEntry.timestamp, SharedService.dateFormatOptions)}
                                                                    </Box>

                                                                    <Box className={classes.level}>
                                                                        {logEntry.level}
                                                                    </Box>

                                                                    <Box className={classes.service}>
                                                                        {logEntry.service}
                                                                    </Box>
                                                                </Box>

                                                                <Box className={classes.serviceMobile}>
                                                                    {logEntry.service}
                                                                </Box>

                                                                <Box className={classes.message}>
                                                                    {logEntry.message}
                                                                </Box>
                                                            </summary>

                                                            {
                                                                logEntry.stack &&
                                                                <Box className={classes.stack}>
                                                                    {logEntry.stack}
                                                                </Box>
                                                            }
                                                        </details>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })
                                    }

                                    <Box className={classes.loadMoreButton}>
                                        <Button onClick={handleLoadMore} variant='contained' color='primary' disabled={loadingMore}>Load More
                                            {loadingMore && (
                                                <CircularProgress size={20} className={classes.loadIndicator} />
                                            )}
                                        </Button>
                                    </Box>
                                </Box>
                            :
                                <Box>No log data was found.</Box>
            }
        </>
    )
};

export default ErrorLog;
