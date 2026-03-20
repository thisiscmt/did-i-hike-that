import React, { useEffect, useState } from 'react';
import {Box, Card, CardContent} from '@mui/material';
import { useNavigate } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import { LogEntry } from '../../models/models.ts';
import TableLoader from '../../components/TableLoader/TableLoader.tsx';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Colors } from '../../services/themeService.ts';
import * as DataService from '../../services/dataService.ts';
import * as SharedService from '../../services/sharedService.ts';
import {dateFormatOptions} from '../../services/sharedService.ts';

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
        gap: '16px'
    },

    timestamp: {
        width: '200px'
    },

    level: {
        textTransform: 'capitalize',
        width: '36px'
    },

    service: {
        width: '56px'
    },

    message: {
        marginTop: '6px'
    },

    stack: {
        whiteSpace: 'pre'
    }
}));

const ErrorLog = () => {
    const { classes, cx } = useStyles();
    const [ logData, setLogData ] = useState<LogEntry[]>([]);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const navigate = useNavigate();

    useDocumentTitle('Error Log - Did I Hike That?');

    useEffect(() => {
        const getLogData = async () => {
            try {
                const response = await DataService.getLogData();
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

    return (
        <>
            {
                loading
                    ?
                        <TableLoader />
                    :
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
                                                                {SharedService.formatISODateValue(logEntry.timestamp, dateFormatOptions)}
                                                            </Box>

                                                            <Box className={classes.level}>
                                                                {logEntry.level}
                                                            </Box>

                                                            <Box className={classes.service}>
                                                                {logEntry.service}
                                                            </Box>
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
                        </Box>
            }
        </>
    )
};

export default ErrorLog;
