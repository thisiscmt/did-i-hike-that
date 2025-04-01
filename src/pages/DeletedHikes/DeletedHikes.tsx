import React, { FC, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import TableLoader from '../../components/TableLoader/TableLoader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Hike, Hiker } from '../../models/models';
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

const DeletedHikes: FC = () => {
    const { classes, cx } = useStyles();
    const [ deletedHikes, setDeletedHikes ] = useState<Hike[]>([]);
    const [ retrievedData, setRetrievedData ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);
    const [ hikeIdToDelete, setHikeIdToDelete ] = useState<string>('');
    const { handleException } = useContext(MainContext);

    useDocumentTitle('Deleted Hikes - Did I Hike That?');

    useEffect(() => {
        const getDeletedHikes = async () => {
            try {
                const response = await DataService.getDeletedHikes();
                setDeletedHikes(response);
            } catch (error) {
                const msgMap: MessageMap = {'403': { message: 'You are not authorized to view this page', severity: 'error' }};
                handleException(error, 'An error occurred retrieving deleted hikes', msgMap);
            } finally {
                setRetrievedData(true);
                setLoading(false);
            }
        }

        if (!retrievedData) {
            getDeletedHikes();
        }
    });

    const handleDeleteHikeClick = async (sid: string) => {
        setHikeIdToDelete(sid);
        setOpenDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = async (value: boolean) => {
        setOpenDeleteConfirmation(false);

        if (value) {
            setLoading(true);

            try {
                await DataService.deleteHikePermanently(hikeIdToDelete);
                window.location.reload();
            } catch (error) {
                handleException(error, 'An error occurred deleting the hike');
            }
        }
    };

    const getHikersAsString = (hikers: Hiker[]) => {
        let hikersStr = '';

        for (const hiker of hikers) {
            hikersStr = hikersStr === '' ? hiker.fullName : `${hikersStr}, ${hiker.fullName}`;
        }

        return hikersStr;
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
                                <Typography variant='h5'>Deleted Hikes</Typography>
                            </Box>

                            <Paper elevation={3}>
                                <TableContainer className={cx(classes.table)}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Trail</TableCell>
                                                <TableCell>Start Date</TableCell>
                                                <TableCell>Hikers</TableCell>
                                                <TableCell>Created By</TableCell>
                                                <TableCell>Last Updated</TableCell>
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {
                                                deletedHikes.length > 0
                                                    ?
                                                        deletedHikes.map((hike: Hike) => {
                                                            return (
                                                                <TableRow hover={false} key={hike.id}>
                                                                    <TableCell align='center' className={cx(classes.deleteButtonColumn)}>
                                                                        <IconButton
                                                                            aria-label='permanently delete hike'
                                                                            title='Permanently delete hike'
                                                                            onClick={() => handleDeleteHikeClick(hike.id || '')}
                                                                            size='small'
                                                                            color='error'
                                                                        >
                                                                            <DeleteOutlineOutlined />
                                                                        </IconButton>
                                                                    </TableCell>
                                                                    <TableCell><Link to={`/hike/${hike.id}`}>{hike.trail}</Link></TableCell>
                                                                    <TableCell>{SharedService.formatDateValue(hike.dateOfHike)}</TableCell>
                                                                    <TableCell>{getHikersAsString(hike.hikers || [])}</TableCell>
                                                                    <TableCell>{hike.user?.email}</TableCell>
                                                                    <TableCell>{SharedService.formatISODateValue(hike.createdAt, SharedService.dateFormatOptions)}</TableCell>
                                                                </TableRow>
                                                            );
                                                        })
                                                    :
                                                        <TableRow>
                                                            <TableCell align='center' colSpan={6}>No deleted hikes found</TableCell>
                                                        </TableRow>
                                            }
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Box>
            }

            <ConfirmationPrompt
                title='Permanently delete this hike?'
                open={openDeleteConfirmation}
                content='Are you sure you want to permanently delete this hike?'
                onClose={handleDeleteConfirmation}
            />
        </>
    );
};

export default DeletedHikes;
