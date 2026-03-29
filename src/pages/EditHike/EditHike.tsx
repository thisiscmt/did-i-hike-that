import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
    Autocomplete,
    type AutocompleteChangeDetails,
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    IconButton,
    LinearProgress,
    ListItem,
    TextField,
    List as MuiList,
    Snackbar,
    Fade
} from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { makeStyles } from 'tss-react/mui';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { arrayMoveImmutable } from 'array-move';
import { type AxiosProgressEvent } from 'axios';
import { DateTime } from 'luxon';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { type Hike, type Hiker, type Photo } from '../../models/models';
import { CustomLuxonAdapter} from '../../classes/customLuxonAdapter';
import { MainContext, type MessageMap } from '../../contexts/MainContext';
import { Colors, SaveIndicatorStyles } from '../../services/themeService';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import * as Constants from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    row: {
        marginBottom: '24px',

        [theme.breakpoints.down(470)]: {
            '& .MuiFormControlLabel-root': {
                flexDirection: 'column-reverse'
            },

            '&.linkLabelField': {
                marginBottom: '8px'
            }
        }
    },

    shortRow: {
        marginBottom: '12px'
    },

    inlineRow: {
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '24px',

        [theme.breakpoints.down(470)]: {
            columnGap: '12px'
        }
    },

    requiredFieldNote: {
        marginBottom: '16px',

        'span:first-of-type': {
            display: 'inline-block',
            minWidth: '100px',
            paddingRight: '16px',

            [theme.breakpoints.down(470)]: {
                minWidth: 0,
                paddingRight: 0
            }
        },

        'span:last-of-type': {
            color: Colors.primaryText,
            fontSize: '16px'
        }
    },

    field: {
        width: '500px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        '&.shortField': {
            width: '400px',

            [theme.breakpoints.down(500)]: {
                width: 'unset'
            }
        },

        [theme.breakpoints.down(768)]: {
            width: 'unset'
        }
    },


    wideField: {
        width: '640px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        [theme.breakpoints.down(768)]: {
            width: '100%'
        }
    },

    multilineTextField: {
        '& .MuiFormControlLabel-root': {
            alignItems: 'flex-start'
        }
    },

    inlineField: {
        width: 'initial',

        '& .MuiTextField-root': {
            width: '170px'
        },
    },

    datePickerField: {
        // Prevents the picker button from being too far to the right
        '& .MuiInputBase-root': {
            paddingRight: '14px'
        }
    },

    fieldLabel: {
        fontSize: '14px',
        fontWeight: 600,
        minWidth: '100px',
        paddingRight: '16px',
        textAlign: 'right',

        [theme.breakpoints.down(470)]: {
            marginBottom: '4px',
            paddingRight: 0,
            textAlign: 'left',
            width: '100%'
        }
    },

    photoFileInput: {
        display: 'flex',
        alignItems: 'center',

        [theme.breakpoints.down(470)]: {
            '& .MuiFormLabel-root': {
                marginBottom: '1px',
                minWidth: '60px',
                width: 'unset'
            }
        }
    },

    fileUploadInput: {
        display: 'none'
    },

    photoList: {
        marginLeft: '116px',
        marginTop: '10px',

        '& .MuiListItem-padding': {
            paddingBottom: 0,
            paddingTop: 0
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        [theme.breakpoints.down(1024)]: {
            '& .MuiListItem-root': {
                flexWrap: 'wrap'
            }
        },

        [theme.breakpoints.down(470)]: {
            marginLeft: 0,

            '& .MuiFormLabel-root': {
                width: '100%'
            }
        }
    },

    photoElement: {
        paddingTop: '20px',

        ':first-child': {
            paddingTop: 0
        }
    },

    photoThumbnail: {
        display: 'flex',
        justifyContent: 'center',
        minWidth: `${Constants.PHOTO_THUMBNAIL_SIZE}px`,

        [theme.breakpoints.down(1024)]: {
            flex: '0 0 100%',
            justifyContent: 'normal',
        }
    },

    photoCaption: {
        display: 'flex',
        marginLeft: '24px',

        [theme.breakpoints.down(1024)]: {
            marginLeft: 0,
            marginTop: '12px',
            width: '250px'
        }
    },

    deletePhotoButton: {
        marginLeft: '4px'
    },

    actions: {
        marginLeft: '116px',
        marginTop: '24px',

        [theme.breakpoints.down(470)]: {
            marginLeft: '0'
        }
    },

    buttonSpacer: {
        marginLeft: '12px'
    },

    progressIndicator: {
        marginLeft: '118px',
        marginTop: '16px',
        width: '522px',

        [theme.breakpoints.down(1024)]: {
            width: 'unset'
        },

        [theme.breakpoints.down(768)]: {
            marginLeft: 0,
            width: '100%'
        }
    },

    saveIndicator: {
        ...SaveIndicatorStyles
    },

    snackbar: {
        '& .MuiSnackbarContent-root': {
            backgroundColor: 'lightslategray'
        }
    }
}));

const MAX_PHOTOS_FOR_UPLOAD = 10;

const EditHike = () => {
    const { classes, cx } = useStyles();
    const { currentHike, searchResultsCache, setCurrentHike, setBanner, storeSearchResults, handleException } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const abortController = useRef<AbortController>(new AbortController());

    const [ trail, setTrail ] = useState<string>('');
    const [ dateOfHike, setDateOfHike ] = useState<DateTime | null>(null);
    const [ endDateOfHike, setEndDateOfHike ] = useState<DateTime | null>(null);
    const [ conditions, setConditions ] = useState<string>('');
    const [ crowds, setCrowds ] = useState<string>('');
    const [ distance, setDistance ] = useState<string>('');
    const [ elevationGain, setElevationGain ] = useState<string>('');
    const [ timeUp, setTimeUp ] = useState<string>('');
    const [ timeDown, setTimeDown ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ knownHikers, setKnownHikers ] = useState<string[]>([]);
    const [ knownTags, setKnownTags ] = useState<string[]>([]);
    const [ hikers, setHikers ] = useState<string[]>([]);
    const [ link, setLink ] = useState<string>('');
    const [ linkLabel, setLinkLabel ] = useState<string>('');
    const [ tags, setTags ] = useState<string[]>([]);
    const [ photos, setPhotos ] = useState<Photo[]>([]);
    const [ retrievedHike, setRetrievedHike ] = useState<boolean>(false);
    const [ clearedHike, setClearedHike ] = useState<boolean>(false);
    const [ retrievedKnownHikers, setRetrievedKnownHikers ] = useState<boolean>(false);
    const [ retrievedKnownTags, setRetrievedKnownTags ] = useState<boolean>(false);
    const [ trailInputError, setTrailInputError ] = useState<boolean>(false);
    const [ dateOfHikeInputError, setDateOfHikeInputError ] = useState<boolean>(false);
    const [ endDateOfHikeInputError, setEndDateOfHikeInputError ] = useState<boolean>(false);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ savingPhoto, setSavingPhoto ] = useState<boolean>(false);
    const [ uploadProgress, setUploadProgress ] = useState<number>(0);
    const [ openSnackbar, setOpenSnackbar ] = useState<boolean>(false);
    const [ snackbarMessage, setSnackbarMessage ] = useState<string>('');

    useDocumentTitle(hikeId ? 'Edit Hike - Did I Hike That?' : 'Create Hike - Did I Hike That?');

    useEffect(() => {
        const setHikeData = (hike: Hike) => {
            setTrail(hike.trail);
            setDateOfHike(DateTime.fromFormat(hike.dateOfHike, 'yyyy-MM-dd'));
            setEndDateOfHike(hike.endDateOfHike ? DateTime.fromFormat(hike.endDateOfHike, 'yyyy-MM-dd') : null);
            setConditions(hike.conditions || '');
            setCrowds(hike.crowds || '');
            setDistance(hike.distance || '');
            setElevationGain(hike.elevationGain || '');
            setTimeUp(hike.timeUp || '');
            setTimeDown(hike.timeDown || '');
            setHikers(hike.hikers?.map((hiker: Hiker) => hiker.fullName) || []);
            setLink(hike.link || '');
            setLinkLabel(hike.linkLabel || '');
            setDescription(hike.description || '');
            setTags(hike.tags ? hike.tags.split(',').map((tag: string) => tag.trim()) : []);

            const newPhotos = (hike.photos || []).map((photo: Photo) => {
                return {
                    ...photo,
                    thumbnailSrc: SharedService.getThumbnailSrc(photo.filePath)
                };
            });

            setPhotos(newPhotos);
            setRetrievedHike(true);
        };

        const clearHikeData = () => {
            setTrail('');
            setDateOfHike(null);
            setEndDateOfHike(null);
            setConditions('');
            setCrowds('');
            setDistance('');
            setElevationGain('');
            setTimeUp('');
            setTimeDown('');
            setHikers([]);
            setLink('');
            setLinkLabel('');
            setDescription('');
            setTags([]);
            setPhotos([]);
            setClearedHike(true);
        };

        const getHike = async () => {
            try {
                if (hikeId) {
                    setBanner('');
                    const hike = await DataService.getHike(hikeId);

                    if (hike) {
                        setHikeData(hike);
                    }
                } else {
                    setBanner('Missing a hike ID', 'error');
                }
            } catch(error) {
                DataService.logError(error);
                setBanner('An error occurred retrieving the hike', 'error');
                window.scrollTo({ top: 0, behavior: 'smooth'});
            }
        };

        if (hikeId) {
            if (!retrievedHike) {
                if (currentHike) {
                    setHikeData(currentHike);
                    setCurrentHike(null);
                } else {
                    getHike();
                }
            }
        } else {
            if (!clearedHike) {
                // This will only occur when the user clicks Add Hike while editing another one
                clearHikeData();
            }
        }
    }, [clearedHike, currentHike, hikeId, retrievedHike, setBanner, setCurrentHike]);

    useEffect(() => {
        const getKnownHikers = async () => {
            try {
                const currentHikers = await DataService.getHikers();

                setKnownHikers(currentHikers);
                setRetrievedKnownHikers(true);
            } catch(error) {
                DataService.logError(error);
                setBanner('An error occurred retrieving hikers', 'error');
                window.scrollTo({ top: 0, behavior: 'smooth'});
            }
        };

        if (!retrievedKnownHikers) {
            getKnownHikers();
        }
    }, [retrievedKnownHikers, setBanner]);

    useEffect(() => {
        const getKnownTags = async () => {
            try {
                const currentTags = await DataService.getTags();

                setKnownTags(currentTags);
                setRetrievedKnownTags(true);
            } catch(error) {
                DataService.logError(error);
                setBanner('An error occurred retrieving tags', 'error');
                window.scrollTo({ top: 0, behavior: 'smooth'});
            }
        };

        if (!retrievedKnownTags) {
            getKnownTags();
        }
    }, [retrievedKnownTags, setBanner]);

    const validInput = () => {
        let valid = true;
        let errorMsg = '';

        if (trail === '') {
            setTrailInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            setTrailInputError(false);
        }

        if (dateOfHike === null) {
            setDateOfHikeInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            if (!dateOfHike.isValid) {
                setDateOfHikeInputError(true);
                valid = false;
                errorMsg = 'Invalid start date value';
            } else {
                setDateOfHikeInputError(false);
            }
        }

        if (endDateOfHike === null) {
            setEndDateOfHikeInputError(false);
        } else {
            if (!endDateOfHike.isValid) {
                setEndDateOfHikeInputError(true);
                valid = false;
                errorMsg = 'Invalid end date value';
            } else {
                setEndDateOfHikeInputError(false);
            }
        }

        if (valid) {
            setBanner('');
        } else {
            setBanner(errorMsg, 'error');
            window.scrollTo({ top: 0, behavior: 'smooth'});
        }

        return valid;
    };

    const getUploadProgressHandler = (): ((progressEvent: AxiosProgressEvent) => void) | undefined => {
        let handler: ((progressEvent: AxiosProgressEvent) => void) | undefined;

        if (photos.find((photo: Photo) => photo.action === 'add' || photo.action === 'update')) {
            handler = handleUploadProgress;
        }

        return handler;
    };

    const handleChangeHikers = (_event: React.SyntheticEvent, value: readonly string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        const newValue = [...value];

        if (reason === 'createOption') {
            if (hikers.find((item: string) => details?.option?.toLowerCase().trim() === item.toLowerCase().trim())) {
                return;
            }

            if (details?.option?.trim() === '') {
                return;
            }

            // We make sure if the user specified an existing hiker, we use that exact name rather than create a duplicate record
            const knownHikerIndex = knownHikers.findIndex((item: string) => details?.option?.toLowerCase() === item.toLowerCase());

            if (knownHikerIndex > -1) {
                const hikerIndex = value.indexOf(details?.option || '');
                newValue[hikerIndex] = knownHikers[knownHikerIndex];
            } else {
                const newHiker = newValue[newValue.length - 1];
                newValue[newValue.length - 1] = newHiker[0].toUpperCase() + newHiker.slice(1);
            }
        }

        setHikers(newValue);
    };

    const handleChangeTags = (_event: React.SyntheticEvent, value: readonly string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        const newValue = [...value];

        if (reason === 'createOption') {
            if (tags.find((item: string) => details?.option?.toLowerCase().trim() === item.toLowerCase().trim())) {
                return;
            }
        }

        setTags(newValue);
    };

    const handleSelectPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            if (photos.length === MAX_PHOTOS_FOR_UPLOAD) {
                return;
            }

            try {
                const newPhotos = [...photos];

                for (const file of event.target.files) {
                    if (file.size > Constants.PHOTO_MAX_SIZE) {
                        setSnackbarMessage(`File '${file.name}' is too big`);
                        setOpenSnackbar(true);
                        continue;
                    } else {
                        setSnackbarMessage('');
                        setOpenSnackbar(false);
                    }

                    const thumbnailSrc = await SharedService.getThumbnailDataSrc(file, Constants.PHOTO_THUMBNAIL_SIZE);
                    const fileName = file.name;
                    const index = newPhotos.findIndex((photo: Photo) => photo.fileName.toLowerCase() === fileName.toLowerCase());

                    if (index > -1) {
                        if (hikeId && newPhotos[index].action !== 'add') {

                            newPhotos[index].file = file;
                            newPhotos[index].action = 'update';
                            newPhotos[index].thumbnailSrc = thumbnailSrc;
                        }
                    } else {
                        const photo: Photo = {
                            file, fileName, filePath: '', caption: '', ordinal: photos.length, action: 'add', thumbnailSrc
                        };

                        newPhotos.push(photo);
                    }
                }

                setPhotos(newPhotos);
            } catch (error) {
                DataService.logError(error);
            }
        }
    };

    const handleChangePhotoCaption = (caption: string, fileName: string) => {
        const index = photos.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index > -1) {
            const newPhotos = [...photos];
            newPhotos[index].caption = caption;

            if (newPhotos[index].action !== 'add') {
                newPhotos[index].action = 'update';
            }

            setPhotos(newPhotos);
        }
    };

    const handleChangePhotoOrder = (result: DropResult) => {
        if (result && result.destination && result.destination.index > -1) {
            const newPhotos = arrayMoveImmutable<Photo>(photos, result.source.index, result.destination.index);
            let newOrdinal = 0;

            for (const photo of newPhotos) {
                if (photo.action !== 'add') {
                    photo.action = 'update';
                }

                photo.ordinal = newOrdinal;
                newOrdinal++;
            }

            setPhotos(newPhotos);
        }
    }

    const handleDeletePhoto = (fileName: string) => {
        const index = photos.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index > -1) {
            const newPhotos = [...photos];

            if (!hikeId) {
                newPhotos.splice(index, 1);
            } else {
                if (newPhotos[index].action === 'add') {
                    newPhotos.splice(index, 1);
                } else {
                    newPhotos[index].action = 'delete';
                }
            }

            setPhotos(newPhotos);
        }
    };

    const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
        setUploadProgress((progressEvent.progress || 0) * 100);
    };

    const handleSave = async () => {
        let hike: Hike | undefined;

        try {
            if (validInput()) {
                setSaving(true);

                const uploadProgressHandler = getUploadProgressHandler();

                if (uploadProgressHandler) {
                    setSavingPhoto(true);
                }

                const hikersToSave = hikers.map((hiker: string) => ({ fullName: hiker }))

                hike = {
                    trail,
                    dateOfHike: dateOfHike ? dateOfHike.toString() : '',
                    endDateOfHike: endDateOfHike ? endDateOfHike.toString() : '',
                    conditions,
                    crowds,
                    distance,
                    elevationGain,
                    timeUp,
                    timeDown,
                    hikers: hikersToSave,
                    description,
                    link,
                    linkLabel,
                    tags: tags.join(','),
                    photos
                };

                let hikeIdForNav = hikeId;
                let response: Hike;

                if (hikeId) {
                    hike.id = hikeId;
                    response = await DataService.updateHike(hike, abortController.current.signal, uploadProgressHandler);

                    if (searchResultsCache && location.state && searchResultsCache[location.state]) {
                        // If this hike is in the cache, update its properties with the latest values
                        const hikeIndex = searchResultsCache[location.state].rows.findIndex((item: Hike) => {
                            return item.id === hikeId;
                        });

                        if (hikeIndex > -1) {
                            const newHikes = {...searchResultsCache[location.state]};

                            newHikes.rows[hikeIndex] = {
                                id: hikeId,
                                caption: '',
                                dateOfHike: response.dateOfHike,
                                description: response.description,
                                endDateOfHike: response.endDateOfHike,
                                filePath: response.photos && response.photos.length > 0 ? response.photos[0].filePath : '',
                                fullNames: response.hikers?.map((hiker: Hiker) => hiker.fullName).join(','),
                                tags: response.tags,
                                trail: response.trail,
                            };

                            storeSearchResults(newHikes, location.state);
                        }
                    }
                } else {
                    response = await DataService.createHike(hike, abortController.current.signal, uploadProgressHandler);
                    hikeIdForNav = response.id;
                }

                setCurrentHike(response);
                navigate(`/hike/${hikeIdForNav}`, { state: location.state });
            }
        } catch (error) {
            const msgMap: MessageMap = {
                'ERR_CANCELED': { message: 'Save was cancelled', severity: 'warning' },
                '400': { message: 'One of the picture files is too large', severity: 'error' }
            };

            handleException(error, 'An error occurred saving the hike', msgMap);

            DataService.logError(error);
            DataService.addLogEntry('Edit Hike - Metadata', 'info', { metadata: SharedService.cloneHike(hike) });
        } finally {
            setSaving(false);
            setSavingPhoto(false);
            window.scrollTo({ top: 0, behavior: 'smooth'});
        }
    };

    const handleCancel = () => {
        if (saving) {
            abortController.current.abort();
            abortController.current = new AbortController();

            setBanner('Save was cancelled', 'info');
            window.scrollTo({ top: 0, behavior: 'smooth'});
        } else {
            if (hikeId) {
                navigate(-1);
            } else {
                navigate('/');
            }
        }
    };

    return (
        <>
            <Grid item xs={12} className={cx(classes.row, classes.requiredFieldNote)}>
                <span></span>
                <span>* Required field</span>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='* Trail'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Trail'
                                margin='none'
                                variant='outlined'
                                value={trail}
                                size='small'
                                error={trailInputError}
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setTrail(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row, classes.inlineRow)}>
                <FormControl className={cx(classes.field, classes.inlineField, classes.datePickerField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='* Start date'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={CustomLuxonAdapter}>
                                <DatePicker
                                    value={dateOfHike}
                                    onChange={(newValue) => setDateOfHike(newValue || null) }
                                    slotProps={{ textField: { size: 'small', error: dateOfHikeInputError, inputProps: {maxLength: 10} } }}
                                />
                            </LocalizationProvider>
                        }
                    />
                </FormControl>

                <FormControl className={`${cx(classes.field, classes.inlineField, classes.datePickerField)}`}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='End date'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={CustomLuxonAdapter}>
                                <DatePicker
                                    value={endDateOfHike}
                                    onChange={(newValue) => setEndDateOfHike(newValue || null) }
                                    slotProps={{ textField: { size: 'small', error: endDateOfHikeInputError, inputProps: {maxLength: 10} } }}
                                />
                            </LocalizationProvider>
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Conditions'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Conditions'
                                margin='none'
                                variant='outlined'
                                value={conditions}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setConditions(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Crowds'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Crowds'
                                margin='none'
                                variant='outlined'
                                value={crowds}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setCrowds(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row, classes.inlineRow)}>
                <FormControl className={cx(classes.field, classes.inlineField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Distance'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Distance'
                                margin='none'
                                variant='outlined'
                                value={distance}
                                size='small'
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setDistance(event.target.value)}
                            />
                        }
                    />
                </FormControl>

                <FormControl className={`${cx(classes.field, classes.inlineField)}`}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Time up'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='TimeUp'
                                margin='none'
                                variant='outlined'
                                value={timeUp}
                                size='small'
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setTimeUp(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row, classes.inlineRow)}>
                <FormControl className={cx(classes.field, classes.inlineField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Elevation gain'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='ElevationGain'
                                margin='none'
                                variant='outlined'
                                value={elevationGain}
                                size='small'
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setElevationGain(event.target.value)}
                            />
                        }
                    />
                </FormControl>

                <FormControl className={`${cx(classes.field, classes.inlineField)}`}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Time down'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='TimeDown'
                                margin='none'
                                variant='outlined'
                                value={timeDown}
                                size='small'
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setTimeDown(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField, classes.multilineTextField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Notes'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Notes'
                                margin='none'
                                variant='outlined'
                                value={description}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                multiline={true}
                                rows={6}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Hikers'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <Autocomplete
                                multiple={true}
                                freeSolo={true}
                                options={knownHikers}
                                getOptionLabel={(option) => option}
                                value={hikers}
                                fullWidth={true}
                                size='small'
                                onChange={handleChangeHikers}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField {...params} multiline={true} rows={1} />
                                )}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Tags'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <Autocomplete
                                multiple={true}
                                freeSolo={true}
                                options={knownTags}
                                getOptionLabel={(option) => option}
                                value={tags}
                                fullWidth={true}
                                size='small'
                                onChange={handleChangeTags}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField {...params} multiline={true} rows={1} />
                                )}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Link'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Link'
                                margin='none'
                                variant='outlined'
                                value={link}
                                type='url'
                                autoComplete='url'
                                size='small'
                                placeholder='Add web address'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setLink(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={`${cx(classes.row)} linkLabelField`}>
                <FormControl className={`${cx(classes.field)} shortField`}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Link label'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='LinkLabel'
                                margin='none'
                                variant='outlined'
                                value={linkLabel}
                                size='small'
                                placeholder='Add label for link'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setLinkLabel(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <Box className={cx(classes.photoFileInput)}>
                    <FormLabel className={cx(classes.fieldLabel)}>Photos</FormLabel>
                        <input
                            type='file'
                            id='FileUpload'
                            name='file'
                            className={classes.fileUploadInput}
                            onChange={handleSelectPhoto}
                            accept='image/*'
                            multiple
                        />
                        <label htmlFor='FileUpload'>
                            <Button component='span'>Browse</Button>
                        </label>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <DragDropContext onDragEnd={handleChangePhotoOrder}>
                    <Droppable droppableId="droppable">
                        {(provided, _snapshot) => (
                            <MuiList ref={provided.innerRef} {...provided.droppableProps} className={cx(classes.photoList)} disablePadding={true}>
                                {
                                    photos.map((photo, index) => {
                                        return (
                                            <Draggable
                                                key={photo.fileName}
                                                index={index}
                                                draggableId={photo.fileName}
                                                shouldRespectForcePress={true}
                                            >
                                                {(provided) => {
                                                    const otherProps = {
                                                        ...provided.draggableProps,
                                                        ...provided.dragHandleProps,
                                                        style: {
                                                            ...provided.draggableProps.style,
                                                        },
                                                    };

                                                    return (
                                                        <>
                                                            {
                                                                photo.action !== 'delete' ?

                                                                <div key={photo.fileName}
                                                                     ref={provided.innerRef}
                                                                     {...otherProps}
                                                                     className={cx(classes.photoElement)}
                                                                >
                                                                    <ListItem disableGutters={true}>
                                                                        <Box className={cx(classes.photoThumbnail)}>
                                                                            <img src={photo.thumbnailSrc} alt='Thumbnail' />
                                                                        </Box>

                                                                        <Box className={cx(classes.photoCaption)}>
                                                                            <TextField
                                                                                id={`hike-photo-${photo.fileName}`}
                                                                                value={photo.caption || ''}
                                                                                style={{ flexGrow: 2 }}
                                                                                size='small'
                                                                                placeholder='Add a caption'
                                                                                inputProps={{ maxLength: 255 }}
                                                                                onChange={(event) => handleChangePhotoCaption(event.target.value, photo.fileName)}
                                                                            />

                                                                            <IconButton
                                                                                aria-label='delete photo'
                                                                                className={cx(classes.deletePhotoButton)}
                                                                                onClick={() => handleDeletePhoto(photo.fileName)}
                                                                                title='Remove photo'
                                                                                size='small'
                                                                                color='error'
                                                                            >
                                                                                <DeleteOutlineOutlined />
                                                                            </IconButton>
                                                                        </Box>
                                                                    </ListItem>
                                                                </div> :

                                                                <div key={photo.fileName} ref={provided.innerRef} {...otherProps}></div>
                                                            }
                                                        </>
                                                    );
                                                }}
                                            </Draggable>
                                        )
                                    })
                                }

                                { provided.placeholder }
                            </MuiList>
                        )}
                    </Droppable>
                </DragDropContext>

                {
                    savingPhoto &&
                    <Box className={cx(classes.progressIndicator)}>
                        <LinearProgress variant="determinate" value={uploadProgress} />
                    </Box>
                }
            </Grid>

            <Grid item xs={12} className={cx(classes.actions)}>
                <Button onClick={handleSave} variant='contained' color='primary' disabled={saving}>Save
                    {saving && (
                        <CircularProgress size={20} className={cx(classes.saveIndicator)} />
                    )}
                </Button>

                <Button onClick={handleCancel} variant='outlined' color='secondary' className={cx(classes.buttonSpacer)}>Cancel</Button>
            </Grid>

            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openSnackbar}
                TransitionComponent={Fade}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                className={classes.snackbar}
            />
        </>
    )
};

export default EditHike;
