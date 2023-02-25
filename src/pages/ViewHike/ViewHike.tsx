import React, {useContext, useEffect, useState} from 'react';
import {Link as RouteLink, useNavigate, useParams} from 'react-router-dom';
import {Box, Button, Card, CardContent, Chip, IconButton, Link, Typography} from '@mui/material';
import {DeleteOutlineOutlined, EditOutlined} from '@mui/icons-material';
import {makeStyles} from 'tss-react/mui';

import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import {Hike, Hiker, Photo} from '../../models/models';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import {MainContext} from '../../contexts/MainContext';

const useStyles = makeStyles()((theme) => ({
    section: {
        marginBottom: '24px',

        '&.chips': {
            marginBottom: '16px'
        }
    },

    field: {
        alignItems: 'baseline',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '8px',

        ':last-child': {
            marginBottom: 0
        }
    },

    fieldLabel: {
        minWidth: '100px'
    },

    shortFieldLabel: {
        minWidth: '60px'
    },

    trail: {
        alignItems: 'flex-start',
        display: 'flex',
        marginBottom: '18px',

        [theme.breakpoints.down(1024)]: {
            '& h4': {
                fontSize: '1.5rem'
            }
        },

        [theme.breakpoints.down(700)]: {
            flexWrap: 'wrap',

            '& a': {
                marginLeft: 0
            },

            '& h4': {
                marginBottom: '12px'
            }
        }
    },

    description: {
        whiteSpace: 'pre-wrap'
    },

    editButton: {
        marginLeft: '12px'
    },

    deleteButton: {
        marginLeft: '4px'
    },

    chip: {
        marginBottom: '8px',
        marginRight: '8px',

        ':last-child': {
            marginRight: 0
        }
    },

    photoContainer: {
        marginBottom: '24px',

        ':last-child': {
            marginBottom: 0
        }
    },

    photo: {
        maxWidth: '100%'
    },

    photoCaption: {
        marginTop: '4px'
    }
}));

const ViewHike = () => {
    const { classes, cx } = useStyles();
    const [ hike, setHike ] = useState<Hike>({ trail: '', dateOfHike: '' });
    const [ openDeleteConfirmation, setIsOpenDeleteConfirmation ] = useState<boolean>(false);
    const { searchText, setHikes } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getHike = async () => {
            try {
                if (hikeId) {
                    const currentHike = await DataService.getHike(hikeId);
                    setHike(currentHike);
                } else {
                    // TODO: Show a message saying the given hike wasn't found
                }
            } catch(error) {
                // TODO: Log this somewhere
            }
        }

        document.title = 'View Hike - Did I Hike That?';
        getHike();
    }, [hikeId]);

    const getValidUrl = () => {
        let valueToCheck = hike.link;
        let url = '';

        if (valueToCheck) {
            if (!valueToCheck.startsWith('http://') && !valueToCheck.startsWith('https://')) {
                valueToCheck = 'http://' + valueToCheck;
            }

            // eslint-disable-next-line
            if (valueToCheck.match(/\b(https?):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[-A-Za-z0-9+&@#\/%=~_|]/)) {
                url = valueToCheck;

                if (url.endsWith('/')) {
                    url = url.slice(0, -1);
                }
            }
        }

        return url;
    }

    const handleDeleteConfirmation = async (value: boolean) => {
        setIsOpenDeleteConfirmation(false);

        if (value) {
            await handleDeleteHike();
        }
    }

    const handleDeleteHike = async () => {
        if (hikeId) {
            await DataService.deleteHike(hikeId);

            const searchParams = SharedService.getSearchParams(searchText);
            const hikes = await DataService.getHikes(searchParams);
            setHikes(hikes.rows);
            navigate(-1);
        }
    };

    const linkUrl = getValidUrl();

    return (
        <Box>
            <Box className={cx(classes.trail)}>
                <Typography variant='h4'>{hike.trail}</Typography>

                <IconButton
                    aria-label='edit hike'
                    className={cx(classes.editButton)}
                    title='Edit hike'
                    component={RouteLink}
                    to={`/hike/${hike.id}/edit`}
                    size='small'
                    color='primary'
                >
                    <EditOutlined />
                </IconButton>

                <IconButton
                    aria-label='delete hike'
                    className={cx(classes.deleteButton)}
                    title='Delete hike'
                    onClick={() => setIsOpenDeleteConfirmation(true)}
                    size='small'
                    color='error'
                >
                    <DeleteOutlineOutlined />
                </IconButton>
            </Box>

            <Card className={cx(classes.section)}>
                <CardContent>
                    <Box>
                        <Box className={cx(classes.field)}>
                            <Typography variant='body2' className={cx(classes.fieldLabel)}>Date of hike</Typography>
                            <Typography variant='body2'>{SharedService.formatDateOfHike(hike.dateOfHike)}</Typography>
                        </Box>

                        {
                            hike.conditions &&
                            <Box className={cx(classes.field)}>
                                <Typography variant='body2' className={cx(classes.fieldLabel)}>Conditions</Typography>
                                <Typography variant='body2'>{hike.conditions}</Typography>
                            </Box>
                        }

                        {
                            hike.crowds &&
                            <Box className={cx(classes.field)}>
                                <Typography variant='body2' className={cx(classes.fieldLabel)}>Crowds</Typography>
                                <Typography variant='body2'>{hike.crowds}</Typography>
                            </Box>
                        }
                    </Box>
                </CardContent>
            </Card>

            {
                hike.description &&
                <Card className={cx(classes.section)}>
                    <CardContent>
                        <Typography variant='body2' className={cx(classes.description)}>{hike.description}</Typography>
                    </CardContent>

                </Card>
            }

            {
                hike.hikers && hike.hikers.length > 0 &&
                <Box className={`${cx(classes.field)} ${cx(classes.section)} chips`}>
                    <Typography variant='body2' className={cx(classes.shortFieldLabel)}>Hikers</Typography>

                    {
                        hike.hikers.map((hiker: Hiker) => (
                            <Chip key={hiker.fullName} label={hiker.fullName} className={cx(classes.chip)}></Chip>
                        ))
                    }
                </Box>
            }

            {
                hike.tags &&
                <Box className={`${cx(classes.field)} ${cx(classes.section)} chips`}>
                    <Typography variant='body2' className={cx(classes.shortFieldLabel)}>Tags</Typography>

                    <Box>
                        {
                            hike.tags.split(',').map((tag: string) => (
                                <Chip key={tag} label={tag} className={cx(classes.chip)}></Chip>
                            ))
                        }
                    </Box>
                </Box>
            }

            {
                hike.link && linkUrl &&
                <Box className={cx(classes.section)}>
                    <Typography variant='body2'>
                        <Link href={linkUrl} target='_blank'>{hike.linkLabel || linkUrl}</Link>
                    </Typography>
                </Box>
            }

            {
                hike.photos && hike.photos.length > 0 &&
                <Box className={cx(classes.section)}>
                    {
                        hike.photos.map((photo: Photo, index: number) => (
                            <Box key={index} className={cx(classes.photoContainer)}>
                                <img src={process.env.REACT_APP_API_URL + '/images/' + photo.filePath} className={cx(classes.photo)} alt='Hike pic' />

                                {
                                    photo.caption &&
                                    <Typography variant='body2' className={cx(classes.photoCaption)}>{photo.caption}</Typography>
                                }
                            </Box>
                        ))

                    }
                </Box>
            }

            <Button variant='contained' color='primary' onClick={() => navigate(-1)}>Back</Button>
            <ConfirmationPrompt title='Delete this hike?' open={openDeleteConfirmation} content='Are you sure you want to delete this hike?' onClose={handleDeleteConfirmation} />
        </Box>
    )
};

export default ViewHike;
