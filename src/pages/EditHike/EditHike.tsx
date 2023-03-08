import React, { FC, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    Box,
    Button, CircularProgress,
    FormControl,
    FormControlLabel, FormLabel,
    Grid,
    IconButton, LinearProgress,
    List,
    ListItem,
    TextField
} from '@mui/material';
import { DeleteOutlineOutlined } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { makeStyles } from 'tss-react/mui';
import { AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import Axios, { AxiosProgressEvent } from 'axios';
import { DateTime } from 'luxon';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { Colors } from '../../services/themeService';
import { Hike, Hiker, Photo } from '../../models/models';
import { MainContext } from '../../contexts/MainContext';

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

    field: {
        width: '500px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        [theme.breakpoints.down(700)]: {
            width: 'unset'
        },

        '&.shortField': {
            width: '350px',

            [theme.breakpoints.down(500)]: {
                width: 'unset'
            }
        }
    },


    wideField: {
        width: '650px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        [theme.breakpoints.down(1024)]: {
            width: '500px'
        },

        [theme.breakpoints.down(700)]: {
            width: '100%'
        }
    },

    multilineTextField: {
        '& .MuiFormControlLabel-root': {
            alignItems: 'flex-start'
        }
    },

    datePickerField: {
        width: 'initial',

        '& .MuiTextField-root': {
            width: '150px'
        },

        // Prevents the picker button from being too far to the right
        '& .MuiInputBase-root': {
            paddingRight: '14px'
        }
    },

    fieldLabel: {
        fontSize: '14px',
        minWidth: '120px',

        [theme.breakpoints.down(470)]: {
            marginBottom: '4px',
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

    photosList: {
        marginLeft: '128px',
        marginTop: '10px',

        '& .MuiListItem-padding': {
            paddingBottom: 0,

            ':first-child': {
                paddingTop: 0
            }
        },

        '& .MuiInputBase-root': {
            paddingRight: 0
        },

        [theme.breakpoints.down(700)]: {
            marginLeft: 0,

            '& .MuiFormLabel-root': {
                width: '100%'
            },

            '& .MuiListItem-root': {
                flexWrap: 'wrap',
                paddingTop: '16px'
            }
        }
    },

    photoFileName: {
        fontSize: '14px',
        marginRight: '10px',
        width: '250px',

        [theme.breakpoints.down(700)]: {
            marginBottom: '4px',
            marginRight: 0
        }
    },

    deletePhotoButton: {
        marginLeft: '4px'
    },

    actions: {
        marginTop: '24px'
    },

    cancelButton: {
        marginLeft: '12px'
    },

    progressIndicator: {
        marginLeft: '128px',
        marginTop: '16px',
        width: '522px',

        [theme.breakpoints.down(1024)]: {
            width: 'unset'
        },

        [theme.breakpoints.down(700)]: {
            marginLeft: 0,
            width: '100%'
        }
    },

    saveIndicator: {
        color: Colors.white,
        position: 'absolute',
    }
}));

const MAX_PHOTOS_FOR_UPLOAD = 10;

interface EditHikeProps {
    topOfPageRef: RefObject<HTMLElement>;
}

const EditHike: FC<EditHikeProps> = ({ topOfPageRef }) => {
    const { classes, cx } = useStyles();
    const { searchResults, setSearchResults, setUpdatedHike, setBanner } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();
    const abortController = useRef<AbortController>(new AbortController());

    const [ trail, setTrail ] = useState<string>('');
    const [ dateOfHike, setDateOfHike ] = useState<DateTime | null>(null);
    const [ conditions, setConditions ] = useState<string>('');
    const [ crowds, setCrowds ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    const [ knownHikers, setKnownHikers ] = useState<string[]>([]);
    const [ hikers, setHikers ] = useState<string[]>([]);
    const [ link, setLink ] = useState<string>('');
    const [ linkLabel, setLinkLabel ] = useState<string>('');
    const [ tags, setTags ] = useState<string[]>([]);
    const [ photos, setPhotos ] = useState<Photo[]>([]);
    const [ retrievedKnownHikers, setRetrievedKnownHikers ] = useState<boolean>(false);
    const [ retrievedHike, setRetrievedHike ] = useState<boolean>(false);
    const [ trailInputError, setTrailInputError ] = useState<boolean>(false);
    const [ dateOfHikeInputError, setDateOfHikeInputError ] = useState<boolean>(false);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ uploadProgress, setUploadProgress ] = useState<number>(0);

    useEffect(() => {
        const getKnownHikers = async () => {
            try {
                const currentHikers = await DataService.getHikers();
                setKnownHikers(currentHikers);
                setRetrievedKnownHikers(true);
            } catch(error) {
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else {
                    setBanner('Error occurred retrieving hikers', 'error');
                }

                SharedService.scrollToTop(topOfPageRef);
            }
        }

        const getHike = async () => {
            try {
                if (hikeId) {
                    setBanner('');
                    const hike = await DataService.getHike(hikeId);

                    if (hike) {
                        setTrail(hike.trail);
                        setDateOfHike(DateTime.fromFormat(hike.dateOfHike, 'yyyy-MM-dd'));
                        setConditions(hike.conditions || '');
                        setCrowds(hike.crowds || '');
                        setHikers(hike.hikers?.map((hiker: Hiker) => hiker.fullName) || []);
                        setLink(hike.link || '');
                        setLinkLabel(hike.linkLabel || '');
                        setDescription(hike.description || '');
                        setTags(hike.tags ? hike.tags.split(',').map((tag: string) => tag.trim()) : []);
                        setPhotos(hike.photos || []);
                        setRetrievedHike(true);
                    }
                } else {
                    setBanner('Missing a hike ID', 'error');
                }

            } catch(error) {
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else {
                    setBanner('Error occurred retrieving the hike', 'error');
                }

                SharedService.scrollToTop(topOfPageRef);
            }
        }

        document.title = 'Edit Hike - Did I Hike That?';

        if (!retrievedKnownHikers) {
            getKnownHikers();
        }

        if (hikeId && !retrievedHike) {
            getHike();
        }
    });

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
                errorMsg = 'Invalid date value';
            } else {
                setDateOfHikeInputError(false);
            }
        }

        if (valid) {
            setBanner('');
        } else {
            setBanner(errorMsg, 'error');
            SharedService.scrollToTop(topOfPageRef);
        }

        return valid;
    };

    const getHikeForSearchResults = (hike: Hike) => {
        let fullNames = '';
        let filePath = '';
        let caption = '';

        if (hike.hikers && hike.hikers.length > 0) {
            fullNames = hike.hikers.map((hiker: Hiker) => hiker.fullName).join(',');
        }

        if (hike.photos && hike.photos.length > 0) {
            filePath = hike.photos[0].filePath;
            caption = hike.photos[0].caption || '';
        }

        return {
            id: hike.id,
            trail: hike.trail,
            dateOfHike: hike.dateOfHike,
            description: hike.description,
            tags: hike.tags,
            fullNames,
            filePath,
            caption
        }
    };

    const getUploadProgressHandler = (): ((progressEvent: AxiosProgressEvent) => void) | undefined => {
        let handler: ((progressEvent: AxiosProgressEvent) => void) | undefined;

        if (photos.find((photo: Photo) => photo.action === 'add' || photo.action === 'update')) {
            handler = handleUploadProgress;
        }

        return handler;
    };

    const handleChangeHikers = (event: React.SyntheticEvent, value: string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        if (reason === 'createOption') {
            if (hikers.find((item: string) => details?.option?.toLowerCase().trim() === item.toLowerCase().trim())) {
                return;
            }

            // We make sure if the user specified an existing hiker, we use that exact name rather than create a duplicate record
           const knownHikerIndex = knownHikers.findIndex((item: string) => details?.option?.toLowerCase() === item.toLowerCase());

            if (knownHikerIndex > -1) {
                const hikerIndex = value.indexOf(details?.option || '');
                value[hikerIndex] = knownHikers[knownHikerIndex];
            }
        }

        setHikers(value);
    };

    const handleChangeTags = (event: React.SyntheticEvent, value: string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        if (reason === 'createOption') {
            if (tags.find((item: string) => details?.option?.toLowerCase().trim() === item.toLowerCase().trim())) {
                return;
            }
        }

        setTags(value);
    };

    const handleSelectPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
        let index: number;
        let photo: Photo;
        let newPhotos = [...photos];

        if (event.target.files && event.target.files.length > 0) {
            if (photos.length === MAX_PHOTOS_FOR_UPLOAD) {
                return;
            }

            const fileName = event.target.files[0].name;
            index = newPhotos.findIndex((photo: Photo) => photo.fileName.toLowerCase() === fileName.toLowerCase());

            if (index > -1) {
                if (hikeId && newPhotos[index].action !== 'add') {
                    newPhotos[index].file = event.target.files[0];
                    newPhotos[index].action = 'update';
                }
            } else {
                photo = {
                    file: event.target.files[0], fileName, filePath: '', caption: '', action: 'add'
                };

                newPhotos.push(photo);
            }

            setPhotos(newPhotos);
        }
    };

    const handleChangePhotoCaption = (fileName: string, caption: string) => {
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

    const handleDeletePhoto = (fileName: string) => {
        const index = photos.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index > -1) {
            const newPhotos = [...photos];
            newPhotos[index].action = 'delete';

            if (hikeId && newPhotos[index].action === 'add') {
                newPhotos.splice(index, 1);
            }

            setPhotos(newPhotos);
        }
    };

    const handleUploadProgress = (progressEvent: AxiosProgressEvent) => {
        setUploadProgress((progressEvent.progress || 0) * 100);
    };

    const handleSave = async () => {
        try {
            if (validInput()) {
                const hikersToSave = hikers.map((hiker: string) => ({ fullName: hiker }))
                const hike: Hike = {
                    trail, dateOfHike: dateOfHike ? dateOfHike.toString() : '', conditions, crowds, hikers: hikersToSave, description, link, linkLabel,
                    tags: tags.join(','), photos
                };
                const uploadProgressHandler = getUploadProgressHandler();
                let hikeIdForNav = hikeId;
                let response: Hike;

                if (uploadProgressHandler) {
                    setSaving(true);
                }

                if (hikeId) {
                    hike.id = hikeId;
                    response = await DataService.updateHike(hike, abortController.current.signal, uploadProgressHandler);

                    const updatedSearchResults = [...searchResults];
                    const index = updatedSearchResults.findIndex((hike: Hike) => hike.id === hikeId);
                    updatedSearchResults[index] = getHikeForSearchResults(response);
                    setSearchResults(updatedSearchResults);
                } else {
                    response = await DataService.createHike(hike, abortController.current.signal, uploadProgressHandler);
                    hikeIdForNav = response.id;
                }

                setUpdatedHike(response);
                setSaving(false);
                navigate(`/hike/${hikeIdForNav}`);
            }
        } catch (error) {
            if (Axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else if (error.code === 'ERR_CANCELED') {
                    setBanner('Save was cancelled', 'warning');
                }
            } else {
                setBanner('Error saving hike', 'error');
            }

            SharedService.scrollToTop(topOfPageRef);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (saving) {
            abortController.current.abort();
            abortController.current = new AbortController();

            // TODO: Tell the user that they have cancelled the request
        } else {
            navigate(-1);
        }
    };

    return (
        <>
            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Trail *'
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

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field, classes.datePickerField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Date of hike *'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DatePicker
                                    value={dateOfHike}
                                    onChange={(newValue) => setDateOfHike(newValue || null) }
                                    renderInput={(params) => (
                                        <TextField {...params} size='small' error={dateOfHikeInputError} inputProps={{ ...params.inputProps, maxLength: 10 }} />
                                    )}
                                />
                            </LocalizationProvider>
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
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
                <FormControl className={cx(classes.field)}>
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
                                options={knownHikers || []}
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
                                options={[]}
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

            <Grid item xs={12} className={`${cx(classes.row)} linkLabelField`}>
                <FormControl className={`${cx(classes.field)} shortField`}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Link'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='LinkLabel'
                                margin='none'
                                variant='outlined'
                                value={linkLabel}
                                size='small'
                                placeholder='Add label'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setLinkLabel(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.wideField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label=''
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Link'
                                margin='none'
                                variant='outlined'
                                value={link}
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
                        />
                        <label htmlFor='FileUpload'>
                            <Button component='span'>Browse</Button>
                        </label>
                </Box>
            </Grid>

            <Grid item xs={12}>
                <List className={cx(classes.photosList)} disablePadding={true}>
                    {
                        photos.map((photo: Photo) => (
                            <React.Fragment key={photo.fileName}>
                                {
                                    photo.action !== 'delete' &&
                                    <ListItem disableGutters={true}>
                                        <FormLabel htmlFor={`hike-photo-${photo.fileName}`} className={cx(classes.photoFileName)}>{SharedService.getFileNameForPhoto(photo)}</FormLabel>

                                        <TextField
                                            id={`hike-photo-${photo.fileName}`}
                                            value={photo.caption || ''}
                                            size='small'
                                            placeholder='Type a caption'
                                            inputProps={{ maxLength: 255 }}
                                            onChange={(event) => handleChangePhotoCaption(photo.fileName, event.target.value)}
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
                                    </ListItem>
                                }
                            </React.Fragment>
                        ))
                    }
                </List>

                {
                    saving &&
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

                <Button onClick={handleCancel} variant='outlined' color='secondary' className={cx(classes.cancelButton)}>Cancel</Button>
            </Grid>
        </>
    )
};

export default EditHike;
