import React, { FC, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import TableLoader from '../../components/TableLoader/TableLoader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { User } from '../../models/models';
import { MainContext, MessageMap } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';

const useStyles = makeStyles()(() => ({
    tableHeader: {
        display: 'flex',
        justifyContent: 'space-between'
    },

    table: {
        marginTop: '14px',

        '& .MuiTableRow-hover': {
            cursor: 'pointer'
        }
    }
}));

const Users: FC = () => {
    const { classes, cx } = useStyles();
    const [ users, setUsers ] = useState<User[]>([]);
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const { handleException } = useContext(MainContext);
    const navigate = useNavigate();

    useDocumentTitle('Users - Did I Hike That?');

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await DataService.getUsers();
                setUsers(response);
            } catch (error) {
                const msgMap: MessageMap = {'403': { message: 'You are not authorized to view this page', severity: 'error' }};
                handleException(error, 'An error occurred retrieving users', msgMap);
            } finally {
                setRetrievedData(true);
                setLoading(false);
            }
        }

        if (!retrievedData) {
            getUsers();
        }
    });

    return (
        <>
            {
                loading
                    ?
                        <TableLoader />
                    :
                        <Box>
                            <Box className={cx(classes.tableHeader)}>
                                <Typography variant='h5'>Users</Typography>
                                <Button variant='contained' component={Link} to='/admin/user/add' color="primary">Add User</Button>
                            </Box>

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
                                            {
                                                users.map((user: User) => (
                                                    <TableRow hover={true} onClick={() => navigate(`/admin/user/${user.id}`)} key={user.id}>
                                                        <TableCell>{user.fullName}</TableCell>
                                                        <TableCell>{user.email}</TableCell>
                                                        <TableCell>{user.role}</TableCell>
                                                        <TableCell>
                                                            {user.lastLogin ? SharedService.formatEpochValue(user.lastLogin, SharedService.dateFormatOptions) : ''}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
            }
        </>
    );
};

export default Users;
