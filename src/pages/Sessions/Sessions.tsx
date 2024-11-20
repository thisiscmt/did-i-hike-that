import React, { FC, useContext, useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { DateTime } from 'luxon';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { Session } from '../../models/models';
import {MainContext, MessageMap} from '../../contexts/MainContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';

const useStyles = makeStyles()(() => ({
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },

    table: {
        marginTop: '12px'
    },

    deleteButtonColumn: {
        paddingBottom: '8px',
        paddingLeft: '8px',
        paddingTop: '8px',
        paddingRight: 0,
        width: '30px'
    }
}));

const Sessions: FC = () => {
    const { classes, cx } = useStyles();
    const [ sessions, setSessions ] = useState<Session[]>([]);
    const [ retrievedSessions, setRetrievedSessions ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ authorized, setAuthorized ] = useState<boolean>(false);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);
    const [ sessionIdToDelete, setSessionIdToDelete ] = useState<string>('');
    const { isLoggedIn, handleException } = useContext(MainContext);

    useEffect(() => {
        const getSessions = async () => {
            try {
                const response = await DataService.getSessions();
                setSessions(response);
                setAuthorized(true);
            } catch (error) {
                const msgMap: MessageMap = {'403': { message: 'You are not authorized to view this page', severity: 'error' }};
                handleException(error, 'An error occurred retrieving sessions', msgMap);
            } finally {
                setRetrievedSessions(true);
                setLoading(false);
            }
        }

        if (!retrievedSessions) {
            getSessions();
        }
    });

    const handleDeleteSessionClick = async (sid: string) => {
        setSessionIdToDelete(sid);
        setOpenDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = async (value: boolean) => {
        setOpenDeleteConfirmation(false);

        if (value) {
            setLoading(true);

            try {
                await DataService.deleteSession(sessionIdToDelete);
                window.location.reload();
            } catch (error) {
                handleException(error, 'An error occurred deleting the session');
            }
        }
    };

    return (
        <Box className='loadable-container'>
            {
                !loading && isLoggedIn() && authorized &&
                <Box>
                    <Box className={cx(classes.tableHeader)}>
                        <Typography variant='h5'>Sessions</Typography>
                    </Box>

                    <Paper elevation={3}>
                        <TableContainer className={cx(classes.table)}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Created</TableCell>
                                        <TableCell>Expires</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        sessions.map((session: Session) => {
                                            const sessionExpiration = SharedService.formatISODateValue(session.expires, DateTime.DATETIME_SHORT);
                                            const sessionCreation = SharedService.formatISODateValue(session.createdAt, DateTime.DATETIME_SHORT);
                                            let sessionEmail = '';
                                            let sessionRole = '';

                                            try {
                                                const data = JSON.parse(session.data);
                                                sessionEmail = data.email;
                                                sessionRole = data.role;
                                            } catch (error) {
                                                // An error is unlikely here, but we catch it just to make sure it doesn't crash everything
                                            }

                                            return (
                                                <TableRow hover={false} key={session.sid}>
                                                    <TableCell align='center' className={cx(classes.deleteButtonColumn)}>
                                                        <IconButton
                                                            aria-label='delete session'
                                                            title='Delete session'
                                                            onClick={() => handleDeleteSessionClick(session.sid)}
                                                            size='small'
                                                            color='error'
                                                        >
                                                            <DeleteOutlineOutlined />
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell>{sessionEmail}</TableCell>
                                                    <TableCell>{sessionRole}</TableCell>
                                                    <TableCell>{sessionCreation}</TableCell>
                                                    <TableCell>{sessionExpiration}</TableCell>
                                                </TableRow>
                                            );
                                        })
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            }

            <ConfirmationPrompt
                title='Delete this session?'
                open={openDeleteConfirmation}
                content='Are you sure you want to delete this session?'
                onClose={handleDeleteConfirmation}
            />

            <LoadingOverlay open={loading} />
        </Box>
    );
};

export default Sessions;
