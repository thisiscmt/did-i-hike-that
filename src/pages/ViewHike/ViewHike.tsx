import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, IconButton, Link, TextField, Typography } from '@mui/material';
import { DeleteOutlineOutlined, EditOutlined, SaveOutlined, CancelOutlined, HomeOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import ViewHikeLoader from '../../components/ViewHikeLoader/ViewHikeLoader';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { Hike, Hiker, Photo } from '../../models/models';
import { MainContext, MessageMap } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';

const useStyles = makeStyles()((theme) => ({
    section: {
        marginBottom: '24px',

        '&.chips, &.photos': {
            marginBottom: '14px'
        },
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
        minWidth: '90px'
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

    buttonSpacer: {
        marginLeft: '4px'
    },

    chipContainer: {
        display: 'flex',
        flexWrap: 'wrap'
    },

    chip: {
        height: 'auto',
        marginBottom: '8px',
        marginRight: '8px',

        '& .MuiChip-label': {
            paddingBottom: '9px',
            paddingTop: '9px',
            display: 'block',
            whiteSpace: 'normal'
        },

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

interface Caption {
    [id: string]: string
}

const ViewHike = () => {
    const { classes, cx } = useStyles();
    const [ hike, setHike ] = useState<Hike>({ trail: '', dateOfHike: '' });
    const [ captions, setCaptions ] = useState<Caption>({});
    const [ retrievedHike, setRetrievedHike ] = useState<boolean>(false);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    const { currentHike, isLoggedIn, setCurrentHike, setBanner, handleException } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useDocumentTitle('View Hike - Did I Hike That?');

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
                const msgMap: MessageMap = {
                    '404': { message: 'Could not find the hike', severity: 'warning' }
                };

                handleException(error, 'An error occurred retrieving the hike', msgMap);
            } finally {
                setRetrievedHike(true);
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth'});
            }
        }

        if (!retrievedHike) {
            if (currentHike && currentHike.id === hikeId) {
                setHike(currentHike);
                setLoading(false);
                setRetrievedHike(true);
            } else {
                getHike();
            }
        }
    }, [hikeId, retrievedHike, currentHike, setCurrentHike, setBanner, handleException]);

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
            try {
                if (hike.deleted) {
                    await DataService.undeleteHike(hikeId);
                } else {
                    await DataService.deleteHike(hikeId);
                }

                setCurrentHike(null);
                navigate('/');
            } catch (error) {
                handleException(error, 'An error occurred deleting the hike');
            }
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
    const loggedIn = isLoggedIn();

    return (
        <>
            {
                loading &&
                <ViewHikeLoader />
            }

            {
                !loading &&
                <>
                    {
                        loggedIn && hike.trail &&
                        <Box className={cx(classes.trail)}>
                            <Typography variant='h4'>{hike.trail}</Typography>

                            <IconButton
                                aria-label='edit hike'
                                title='Edit hike'
                                onClick={() => navigate(`/hike/${hike.id}/edit`, { state: location.state })}
                                size='small'
                                color='primary'
                                disabled={hike.deleted}
                            >
                                <EditOutlined />
                            </IconButton>

                            <IconButton
                                aria-label='delete hike'
                                className={cx(classes.buttonSpacer)}
                                title={hike.deleted ? 'Un-delete hike' : 'Delete hike'}
                                onClick={() => setOpenDeleteConfirmation(true)}
                                size='small'
                                color='error'
                            >
                                <DeleteOutlineOutlined />
                            </IconButton>

                            {
                                location.state &&
                                <IconButton
                                    aria-label='go back home'
                                    className={cx(classes.buttonSpacer)}
                                    title='Go back home'
                                    onClick={() => navigate(`/?${location.state}`)}
                                    size='small'
                                    color='secondary'
                                >
                                    <HomeOutlined />
                                </IconButton>
                            }
                        </Box>
                    }

                    {
                        hasHikeBasicData &&
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
                        <Box className={`${cx(classes.section)} photos`}>
                            {
                                hike.photos.map((photo: Photo, index: number) => {
                                    let imgSource = `${process.env.REACT_APP_API_URL}/images/`;

                                    if (hike.deleted) {
                                        imgSource += photo.filePath.replace('/', '_deleted/');
                                    } else {
                                        imgSource += photo.filePath;
                                    }

                                    return (
                                        <Box key={index} className={cx(classes.photoContainer)}>
                                            <img src={imgSource} className={cx(classes.photo)} alt='Hike pic'/>

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
                                                            inputProps={{maxLength: 255}}
                                                            onChange={(event) => handlePhotoCaptionChange(event.target.value, photo.fileName)}
                                                        />

                                                        <IconButton
                                                            aria-label='save caption'
                                                            title='Save caption'
                                                            size='small'
                                                            color='primary'
                                                            onClick={() => handleSavePhotoCaption(photo.fileName)}
                                                        >
                                                            <SaveOutlined/>
                                                        </IconButton>

                                                        <IconButton
                                                            aria-label='cancel save caption'
                                                            title='Cancel'
                                                            size='small'
                                                            color='default'
                                                            onClick={() => handleCancelSavePhotoCaption(photo.fileName)}
                                                        >
                                                            <CancelOutlined/>
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
                                                                        <Typography variant='body2'
                                                                                    className={`${cx(classes.photoCaption)} ${cx(classes.noCaption)}`}>
                                                                            Add a caption
                                                                        </Typography>
                                                                    </Button>
                                                                </Box>
                                                        }
                                                    </>
                                            }
                                        </Box>
                                    );
                                })
                            }
                        </Box>
                    }

                    {
                        loggedIn &&
                        <>
                            {
                                formattedUpdatedAt &&
                                <Box className={cx(classes.section)}>
                                    <Typography variant='body2' className={cx(classes.lastUpdated)}>{`Last updated on ${formattedUpdatedAt}`}</Typography>
                                </Box>
                            }

                            <Button variant='contained' color='primary' onClick={() => navigate(-1)}>Go Back</Button>
                        </>
                    }

                    <ConfirmationPrompt
                        title={hike.deleted ? 'Un-delete this hike?' : 'Delete this hike?'}
                        open={openDeleteConfirmation}
                        content={hike.deleted ? 'Are you sure you want to un-delete this hike?' : 'Are you sure you want to delete this hike?'}
                        onClose={handleDeleteConfirmation}
                    />
                </>
            }
        </>
    );
};

export default ViewHike;
