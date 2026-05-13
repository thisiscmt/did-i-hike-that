import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, FormControl, FormControlLabel, MenuItem, Select } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { LogEntry } from '../../models/models.ts';
import TableLoader from '../../components/TableLoader/TableLoader.tsx';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { MainContext } from '../../contexts/MainContext';
import { Colors, SaveIndicatorStyles } from '../../services/themeService.ts';
import { LogService } from '../../services/dataService.ts';
import * as DataService from '../../services/dataService.ts';
import * as SharedService from '../../services/sharedService.ts';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        flexDirection: 'column',
        rowGap: '10px'
    },

    controlPanel: {
        alignItems: 'center',
        columnGap: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '10px',
        rowGap: '20px'
    },

    serviceSelectorField: {
        marginLeft: 0
    },

    serviceSelector: {
        width: '200px'
    },

    fieldLabel: {
        fontWeight: 600,
        paddingRight: '16px'
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
            transition: 'margin 300ms ease-out'
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

        [theme.breakpoints.down(450)]: {
            display: 'none'
        }
    },

    serviceMobile: {
        display: 'none',

        [theme.breakpoints.down(450)]: {
            display: 'block',
            marginTop: '4px'
        }
    },

    message: {
        marginTop: '6px',
        overflowX: 'auto'
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
    },

    pm2Log: {
        color: Colors.pm2LogEntry,
        overflowX: 'auto',
        whiteSpace: 'pre-line'
    }
}));

const SystemLog = () => {
    const { classes, cx } = useStyles();
    const { handleError } = useContext(MainContext);
    const [ logData, setLogData ] = useState<LogEntry[]>([]);
    const [ pm2LogData, setPM2LogData ] = useState<string>('');
    const [ page, setPage ] = useState<number>(1);
    const [ service, setService ] = useState<LogService>('all');
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ loadingMore, setLoadingMore ] = useState<boolean>(false);
    const [ clearing, setClearing ] = useState<boolean>(false);
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const pageSize = SharedService.getDefaultPageSize();

    useDocumentTitle('Error Log - Did I Hike That?');

    useEffect(() => {
        const getLogData = async () => {
            try {
                if (service === 'api' || service === 'checkpoint') {
                    const response = await DataService.getPM2LogData(service);

                    setPM2LogData(response);
                    setLogData([]);
                } else {
                    const response = await DataService.getLogData(page, pageSize, service);

                    setPM2LogData('');
                    setLogData(response);
                }
            } catch (error) {
                handleError(error);
            } finally {
                setRetrievedData(true);
                setLoading(false);
            }
        }

        if (!retrievedData) {
            getLogData();
        }
    }, [service, page, pageSize, retrievedData, handleError]);

    const handleLoadMore = async () => {
        try {
            setLoadingMore(true);

            const newPage = page + 1;
            const response = await DataService.getLogData(newPage, pageSize, service);

            if (response.length > 0) {
                setLogData(logData.concat(response));
                setPage(newPage);
            }
        } catch (error) {
            handleError(error, 'An error occurred retrieving log data');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleClear = async () => {
        try {
            setClearing(true);
            await DataService.clearLog(service);

            if (service === 'api' || service === 'checkpoint') {
                setPM2LogData('');
            } else {
                setLogData([]);
            }
        } catch (error) {
            handleError(error, 'An error occurred clearing log data');
        } finally {
            setClearing(false);
        }
    };

    return (
        <>
            {
                loading
                    ?
                        <TableLoader />
                    :
                        <Box className={classes.mainContainer}>
                            <Box className={cx(classes.controlPanel)}>
                                <FormControl size='small'>
                                    <FormControlLabel
                                        labelPlacement='start'
                                        label='Service'
                                        className={cx(classes.serviceSelectorField)}
                                        classes={{label: classes.fieldLabel}}
                                        control={
                                            <Box>
                                                <Select
                                                    value={service}
                                                    onChange={(event) => {
                                                        setService(event.target.value as LogService);
                                                        setLoading(true);
                                                        setRetrievedData(false);
                                                    }}
                                                    className={cx(classes.serviceSelector)}
                                                >
                                                    <MenuItem value='all'>All</MenuItem>
                                                    <MenuItem value='diht-api'>DIHT API</MenuItem>
                                                    <MenuItem value='diht-ui'>DIHT UI</MenuItem>
                                                    <MenuItem value='api'>PM API</MenuItem>
                                                    <MenuItem value='checkpoint'>PM Checkpoint</MenuItem>
                                                </Select>
                                            </Box>
                                        }
                                    />
                                </FormControl>

                                {
                                    (logData.length > 0 || pm2LogData) &&
                                    <Button onClick={handleClear} variant='contained' color='primary' disabled={clearing}>Clear Log
                                        {clearing && (
                                            <CircularProgress size={20} className={cx(classes.loadIndicator)} />
                                        )}
                                    </Button>
                                }
                            </Box>

                            {
                                (logData.length > 0 || pm2LogData) ?
                                    <>
                                        {
                                            (service === 'all' || service === 'diht-api' || service === 'diht-ui') ?
                                                <>
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

                                                            let formattedMessage = '';

                                                            if (typeof logEntry.message === 'string') {
                                                                formattedMessage = logEntry.message;
                                                            } else {
                                                                formattedMessage = 'DIHT event'

                                                                if (!logEntry.metadata) {
                                                                    logEntry.metadata = logEntry.message;
                                                                }
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
                                                                                    {formattedMessage}
                                                                                </Box>
                                                                            </summary>

                                                                            {
                                                                                logEntry.stack &&
                                                                                <Box className={classes.stack}>
                                                                                    {logEntry.stack}
                                                                                </Box>
                                                                            }

                                                                            {
                                                                                logEntry.metadata &&
                                                                                <Box className={classes.stack}>
                                                                                    { JSON.stringify(logEntry.metadata, null, 4) }
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
                                                </> :
                                                <Box className={cx(classes.pm2Log)}>
                                                    {pm2LogData}
                                                </Box>
                                        }
                                    </> :
                                    <Box>No log data was found.</Box>
                            }
                    </Box>
            }
        </>
    )
};

export default SystemLog;
