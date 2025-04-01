import React, { FC, useContext, useEffect, useState } from 'react';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import TableLoader from '../../components/TableLoader/TableLoader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Session } from '../../models/models';
import { MainContext, MessageMap } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';

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
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);
    const [ sessionIdToDelete, setSessionIdToDelete ] = useState<string>('');
    const { handleException } = useContext(MainContext);

    useDocumentTitle('Sessions - Did I Hike That?');

    useEffect(() => {
        const getSessions = async () => {
            try {
                const response = await DataService.getSessions();
                setSessions(response);
            } catch (error) {
                const msgMap: MessageMap = {'403': { message: 'You are not authorized to view this page', severity: 'error' }};
                handleException(error, 'An error occurred retrieving sessions', msgMap);
            } finally {
                setRetrievedData(true);
                setLoading(false);
            }
        }

        if (!retrievedData) {
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
        <>
            {
                loading
                    ?
                        <TableLoader />
                    :
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
                                                sessions.length > 0
                                                    ?
                                                        sessions.map((session: Session) => {
                                                            const sessionExpiration = SharedService.formatISODateValue(session.expires, SharedService.dateFormatOptions);
                                                            const sessionCreation = SharedService.formatISODateValue(session.createdAt, SharedService.dateFormatOptions);
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
                                                    :
                                                        <TableRow>
                                                            <TableCell align='center' colSpan={6}>No sessions found</TableCell>
                                                        </TableRow>
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
        </>
    );
};

export default Sessions;
