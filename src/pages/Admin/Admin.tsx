import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { User } from '../../models/models';
import {MainContext} from '../../contexts/MainContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';

const useStyles = makeStyles()(() => ({
    mainContainer: {
        height: '100vh'
    },

    table: {
        marginTop: '12px',

        '& .MuiTableRow-hover': {
            cursor: 'pointer'
        }
    }
}));

const Admin: FC = () => {
    const { classes, cx } = useStyles();
    const [ users, setUsers ] = useState<User[]>([]);
    const [ retrievedUsers, setRetrievedUsers ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ authorized, setAuthorized ] = useState<boolean>(false);
    const { loggedIn, setBanner } = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await DataService.getUsers()
                setUsers(response);
                setAuthorized(true);
            } catch (error) {
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else if (Axios.isAxiosError(error) && error.response?.status === 403) {
                    setBanner('You are not authorized to view this page', 'warning');
                } else {
                    setBanner('Error occurred retrieving users', 'error');
                }
            } finally {
                setRetrievedUsers(true);
                setLoading(false);
            }
        }

        if (!retrievedUsers) {
            getUsers();
        }
    });

    return (
        <Box className={`${cx(classes.mainContainer)} loadable-container`}>
            {
                !loading && loggedIn && authorized &&
                <Box>
                    <Typography variant='h5'>Users</Typography>

                    <Paper elevation={3}>
                        <TableContainer className={cx(classes.table)}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Last Login</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {users.map((user: User) => (
                                        <TableRow hover={true} onClick={() => navigate(`/admin/user/${user.id}`)} key={user.id}>
                                            <TableCell>{user.fullName}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.role}</TableCell>
                                            <TableCell>{user.lastLogin ? SharedService.formatEpochValue(user.lastLogin) : ''}</TableCell>
                                        </TableRow>
                                    ))}
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

export default Admin;
