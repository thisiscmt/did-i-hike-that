import React, { FC, RefObject, useContext, useEffect, useState } from 'react';
import { Link as RouteLink, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, IconButton, Link, TextField, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, SaveOutlined, CancelOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import { Hike, Hiker, Photo } from '../../models/models';
import { MainContext } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';

const useStyles = makeStyles()((theme) => ({
    section: {
        marginBottom: '24px',

        '&.chips': {
            marginBottom: '14px'
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
        alignItems: 'center',
        display: 'flex',
        marginBottom: '18px',

        '& h4': {
            marginRight: '12px'
        },

        [theme.breakpoints.down(1024)]: {
            '& h4': {
                fontSize: '1.5rem'
            }
        },

        [theme.breakpoints.down(700)]: {
            flexWrap: 'wrap',

            '& h4': {
                flexBasis: '100%',
                marginBottom: '12px'
            },
        }
    },

    description: {
        whiteSpace: 'pre-wrap'
    },

    deleteButton: {
        marginLeft: '4px'
    },

    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap'
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
        marginTop: '4px',
        textTransform: 'none',
    },

    noCaption: {
        fontStyle: 'italic'
    },

    photoCaptionEditContainer: {
        marginTop: '4px',

        '& .MuiButtonBase-root': {
            marginTop: '3px'
        }
    },

    photoCaptionEdit: {
        minWidth: 0
    },

    photoCaptionInput: {
        marginRight: '8px'
    },

    lastUpdated: {
        fontSize: '12px',
        textAlign: 'center'
    }
}));

interface ViewHikeProps {
    topOfPageRef: RefObject<HTMLElement>;
}

interface Caption {
    [id: string]: string
}

const ViewHike: FC<ViewHikeProps> = ({ topOfPageRef }) => {
    const { classes, cx } = useStyles();
    const [ hike, setHike ] = useState<Hike>({ trail: '', dateOfHike: '' });
    const [ captions, setCaptions ] = useState<Caption>({});
    const [ retrievedHike, setRetrievedHike ] = useState<boolean>(false);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const { searchResults, currentHike, loggedIn, setSearchResults, setCurrentHike, setBanner } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const getHike = async () => {
            try {
                if (hikeId) {
                    setBanner('');
                    const hike = await DataService.getHike(hikeId);

                    setHike(hike);
                    setCurrentHike(hike);
                    setRetrievedHike(true);
                } else {
                    setBanner('Missing a hike ID', 'error');
                }
            } catch(error) {
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else if (Axios.isAxiosError(error) && error.response?.status === 404) {
                    setBanner('Could not find the hike', 'warning');
                } else {
                    setBanner('Error occurred retrieving the hike', 'error');
                }

                SharedService.scrollToTop(topOfPageRef);
            } finally {
                setRetrievedHike(true);
                setLoading(false);
            }
        }

        document.title = 'View Hike - Did I Hike That?';

        if (!retrievedHike) {
            if (currentHike && currentHike.id === hikeId) {
                setHike(currentHike);
                setLoading(false);
                setRetrievedHike(true);
            } else {
                getHike();
            }
        }
    }, [hikeId, retrievedHike, currentHike, setCurrentHike, setBanner, topOfPageRef]);

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
    };

    const handleDeleteConfirmation = async (value: boolean) => {
        setOpenDeleteConfirmation(false);

        if (value && hikeId) {
            await DataService.deleteHike(hikeId);

            const updatedSearchResults = [...searchResults];
            const index = updatedSearchResults.findIndex((hike: Hike) => hike.id === hikeId);
            updatedSearchResults.splice(index, 1);
            setSearchResults(updatedSearchResults);

            navigate('/');
        }
    };

    const handlePhotoCaptionEdit = (fileName: string) => {
        const index = hike.photos?.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index !== undefined && index > -1) {
            const newHike = structuredClone(hike);
            newHike.photos![index].editCaption = true;
            captions[fileName] = newHike.photos![index].caption || '';

            setHike(newHike);
        }
    };

    const handlePhotoCaptionChange = (caption: string, fileName: string) => {
        const newCaptions = { ...captions };
        newCaptions[fileName] = caption;
        setCaptions(newCaptions);
    };

    const handleSavePhotoCaption = async (fileName: string) => {
        const index = hike.photos?.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index !== undefined && index > -1) {
            const newHike = structuredClone(hike);
            newHike.photos![index].caption = captions[fileName];
            newHike.photos![index].editCaption = false;
            newHike.photos![index].action = 'update';

            const response = await DataService.updateHike(newHike);
            newHike.updatedAt = response.updatedAt;

            setCurrentHike(newHike);
            setHike(newHike);
        }
    };

    const handleCancelSavePhotoCaption = (fileName: string) => {
        const index = hike.photos?.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index !== undefined && index > -1) {
            const newHike = structuredClone(hike);
            newHike.photos![index].editCaption = false;
            setHike(newHike);
        }
    };

    const linkUrl = getValidUrl();
    const hasHikeBasicData = hike.dateOfHike || hike.endDateOfHike || hike.conditions || hike.crowds;
    const formattedUpdatedAt = SharedService.formatISODateValue(hike.updatedAt);

    return (
        <Box className='loadable-container'>
            {
                !loading && loggedIn && hike.trail &&
                <Box className={cx(classes.trail)}>
                    <Typography variant='h4'>{hike.trail}</Typography>

                    <IconButton
                        aria-label='edit hike'
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
                        onClick={() => setOpenDeleteConfirmation(true)}
                        size='small'
                        color='error'
                    >
                        <DeleteOutlineOutlined />
                    </IconButton>
                </Box>
            }

            {
                !loading && loggedIn && hasHikeBasicData &&
                <Card className={cx(classes.section)}>
                    <CardContent>
                        <Box>
                            <>
                                {
                                    hike.dateOfHike &&
                                    <Box className={cx(classes.field)}>
                                        <Typography variant='body2' className={cx(classes.fieldLabel)}>Start date</Typography>
                                        <Typography variant='body2'>{SharedService.formatDateValue(hike.dateOfHike)}</Typography>
                                    </Box>
                                }

                                {
                                    hike.endDateOfHike &&
                                    <Box className={cx(classes.field)}>
                                        <Typography variant='body2' className={cx(classes.fieldLabel)}>End date</Typography>
                                        <Typography variant='body2'>{SharedService.formatDateValue(hike.endDateOfHike)}</Typography>
                                    </Box>
                                }

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
                            </>
                        </Box>
                    </CardContent>
                </Card>
            }

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

                    <Box className={cx(classes.chipContainer)}>
                        {
                            hike.hikers.map((hiker: Hiker) => (
                                <Chip key={hiker.fullName} label={hiker.fullName} className={cx(classes.chip)}></Chip>
                            ))
                        }
                    </Box>
                </Box>
            }

            {
                hike.tags &&
                <Box className={`${cx(classes.field)} ${cx(classes.section)} chips`}>
                    <Typography variant='body2' className={cx(classes.shortFieldLabel)}>Tags</Typography>

                    <Box className={cx(classes.chipContainer)}>
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
                                    photo.editCaption ?
                                        <Box className={cx(classes.photoCaptionEditContainer)}>
                                            <TextField
                                                name='Caption'
                                                margin='none'
                                                variant='outlined'
                                                value={captions[photo.fileName]}
                                                size='small'
                                                className={cx(classes.photoCaptionInput)}
                                                autoCorrect='off'
                                                inputProps={{ maxLength: 255 }}
                                                onChange={(event) => handlePhotoCaptionChange(event.target.value, photo.fileName)}
                                            />

                                            <IconButton
                                                aria-label='save caption'
                                                title='Save caption'
                                                size='small'
                                                color='primary'
                                                onClick={() => handleSavePhotoCaption(photo.fileName)}
                                            >
                                                <SaveOutlined />
                                            </IconButton>

                                            <IconButton
                                                aria-label='cancel save caption'
                                                title='Cancel'
                                                size='small'
                                                color='default'
                                                onClick={() => handleCancelSavePhotoCaption(photo.fileName)}
                                            >
                                                <CancelOutlined />
                                            </IconButton>
                                        </Box> :

                                        <>
                                            {
                                                photo.caption
                                                    ?
                                                        <Box>
                                                            <Button variant='text' title='Change caption' className={cx(classes.photoCaptionEdit)}
                                                                    onClick={() => handlePhotoCaptionEdit(photo.fileName)}>
                                                                <Typography variant='body2' className={cx(classes.photoCaption)}>
                                                                    {photo.caption}
                                                                </Typography>
                                                            </Button>
                                                        </Box>
                                                    :
                                                        <Box>
                                                            <Button variant='text' onClick={() => handlePhotoCaptionEdit(photo.fileName)}>
                                                                <Typography variant='body2' className={`${cx(classes.photoCaption)} ${cx(classes.noCaption)}`}>
                                                                    Add a caption
                                                                </Typography>
                                                            </Button>
                                                        </Box>
                                            }
                                        </>
                                }
                            </Box>
                        ))
                    }
                </Box>
            }

            {
                !loading && loggedIn &&
                <>
                    {
                        formattedUpdatedAt &&
                        <Box className={cx(classes.section)}>
                            <Typography variant='body2' className={cx(classes.lastUpdated)}>{`Last updated on ${formattedUpdatedAt}`}</Typography>
                        </Box>
                    }

                    <Button variant='contained' color='primary' onClick={() => navigate('/')}>Go to Home</Button>
                </>
            }

            <ConfirmationPrompt
                title='Delete this hike?'
                open={openDeleteConfirmation}
                content='Are you sure you want to delete this hike?'
                onClose={handleDeleteConfirmation}
            />

            <LoadingOverlay open={loading} />
        </Box>
    )
};

export default ViewHike;
