import React, {FC, useEffect, useState} from 'react';
import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';
import { makeStyles} from 'tss-react/mui';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { User } from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    row: {
        '&:last-child td, &:last-child th': {
            border: 0
        }
    }

}));

const Admin: FC = () => {
    const { classes, cx } = useStyles();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await DataService.getUsers()

            setUsers(response);
        }

        if (users.length === 0) {
            getUsers();
        }
    });

    return (
        <Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Last Updated</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map((user: User) => (
                            <TableRow key={user.id} className={cx(classes.row)}>
                                <TableCell component='th' scope='row'>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{SharedService.formatISODateValue(user.updatedAt)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    );
};

export default Admin;
