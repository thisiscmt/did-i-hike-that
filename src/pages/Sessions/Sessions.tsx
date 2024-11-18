import React, { FC, useContext, useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';
import { DateTime } from 'luxon';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { Session } from '../../models/models';
import { MainContext } from '../../contexts/MainContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';

const useStyles = makeStyles()(() => ({
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },

    table: {
        marginTop: '12px'
    },

    deleteButtonColumn: {
        paddingLeft: '8px',
        paddingRight: 0
    },

    deleteButton: {
        padding: 0
    }
}));

const Sessions: FC = () => {
    const { classes, cx } = useStyles();
    const [ sessions, setSessions ] = useState<Session[]>([]);
    const [ retrievedSessions, setRetrievedSessions ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ authorized, setAuthorized ] = useState<boolean>(false);
    const { isLoggedIn, setBanner } = useContext(MainContext);

    useEffect(() => {
        const getSessions = async () => {
            try {
                const response = await DataService.getSessions();
                setSessions(response);
                setAuthorized(true);
            } catch (error) {
                if (Axios.isAxiosError(error) && error.response?.status === 403) {
                    setBanner('You are not authorized to view this page', 'error');
                } else {
                    setBanner('Error occurred retrieving sessions', 'error');
                }
            } finally {
                setRetrievedSessions(true);
                setLoading(false);
            }
        }

        if (!retrievedSessions) {
            getSessions();
        }
    });

    const handleDeleteSession = async (sid: string) => {
        try {
            setLoading(true);
            await DataService.deleteSession(sid);

            window.location.reload();
        } catch (error) {
            setBanner('Error occurred deleting the session', 'error');
        } finally {
            setLoading(false);
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
                                                            onClick={() => handleDeleteSession(session.sid)}
                                                            size='small'
                                                            color='error'
                                                            className={cx(classes.deleteButton)}
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

            <LoadingOverlay open={loading} />
        </Box>
    );
};

export default Sessions;
