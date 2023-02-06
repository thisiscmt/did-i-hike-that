import React, {FC, RefObject, useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
    Autocomplete,
    AutocompleteChangeDetails,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    TextField,
    Typography
} from '@mui/material';
import {DeleteOutlineOutlined} from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import { makeStyles } from 'tss-react/mui';

import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import {Hike, Hiker, Photo} from '../../models/models';
import {MainContext} from '../../contexts/MainContext';

const useStyles = makeStyles()((theme) => ({
    content: {
    },

    row: {
        marginBottom: '24px'
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

    photosField: {
        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        }
    },

    photoCaptionField: {
        width: '350px'
    },

    fieldLabel: {
        minWidth: '120px'
    },

    fileUploadInput: {
        display: 'none'
    },

    photosList: {
        marginLeft: '113px',
        marginTop: '8px',

        '& .MuiListItem-gutters': {
            paddingBottom: 0,

            ':first-child': {
                paddingTop: 0
            }
        }
    },

    photoFileName: {
        width: '250px'
    },

    photoCaptionLabel: {
        '& .MuiFormControlLabel-label': {
            marginRight: '10px',
        }
    },

    deletePhotoButton: {
        marginLeft: '4px'
    },

    actions: {
        marginTop: '24px'
    }
}));

interface EditHikeProps {
    topOfPageRef: RefObject<HTMLElement>;
}

const EditHike: FC<EditHikeProps> = ({ topOfPageRef }) => {
    const { classes, cx } = useStyles();
    const { setBanner } = useContext(MainContext);
    const { hikeId } = useParams();
    const navigate = useNavigate();

    const [ trail, setTrail ] = useState<string>('');
    const [ dateOfHike, setDateOfHike ] = useState<string | null>(null);
    const [ conditions, setConditions ] = useState<string>('');
    const [ crowds, setCrowds ] = useState<string>('');
    const [ knownHikers, setKnownHikers ] = useState<string[]>([]);
    const [ hikers, setHikers ] = useState<string[]>([]);
    const [ notes, setNotes ] = useState<string>('');
    const [ link, setLink ] = useState<string>('');
    const [ tags, setTags ] = useState<string[]>([]);
    const [ photos, setPhotos ] = useState<Photo[]>([]);
    const [ retrievedKnownHikers, setRetrievedKnownHikers ] = useState<boolean>(false);
    const [ retrievedHike, setRetrievedHike ] = useState<boolean>(false);
    const [ trailInputError, setTrailInputError ] = useState<boolean>(false);
    const [ dateOfHikeInputError, setDateOfHikeInputError ] = useState<boolean>(false);

    useEffect(() => {
        const getKnownHikers = async () => {
            try {
                const currentHikers = await DataService.getHikers();
                setKnownHikers(currentHikers);
                setRetrievedKnownHikers(true);
            } catch(error) {
                // TODO: Log this somewhere
            }
        }

        const getHike = async () => {
            try {
                const hike = await DataService.getHike(hikeId || '');

                if (hike) {
                    setTrail(hike.trail);
                    setDateOfHike(hike.dateOfHike);
                    setConditions(hike.conditions || '');
                    setCrowds(hike.crowds || '');
                    setHikers(hike.hikers?.map((hiker: Hiker) => hiker.fullName));
                    setLink(hike.link || '');
                    setNotes(hike.description || '');
                    setTags(hike.tags ? hike.tags.split(',').map((tag: string) => tag.trim()) : []);
                    setPhotos(hike.photos);

                    setRetrievedHike(true);
                }
            } catch(error) {

                // TODO: Log this somewhere
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

    const handleChangeHikers = (event: React.SyntheticEvent, value: string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        if (reason === 'createOption') {
            // We make sure if the user specified an existing hiker, we use that exact name rather than create a duplicate in the database
           const knownHikerIndex = knownHikers.findIndex((item: string) => details?.option?.toLowerCase() === item.toLowerCase());

            if (knownHikerIndex > -1) {
                const hikerIndex = value.indexOf(details?.option || '');
                value[hikerIndex] = knownHikers[knownHikerIndex];
            }
        }

        setHikers(value);
    };

    const handleChangeTags = (event: React.SyntheticEvent, value: string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        setTags(value);
    };

    const handleSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event && event.target && event.target.files && event.target.files.length > 0) {
            setPhotos([...photos, { file: event.target.files[0], fileName: event.target.files[0].name, filePath: '', caption: ''}])
        }
    };

    const handleUpdatePhotoCaption = (fileName: string, caption: string) => {
        const index = photos.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index > -1) {
            const newPhotos = [...photos];
            newPhotos[index].caption = caption;
            setPhotos(newPhotos);
        }
    };

    const handleDeletePhoto = (fileName: string) => {
        const index = photos.findIndex((photo: Photo) => photo.fileName === fileName);

        if (index > -1) {
            const newPhotos = [...photos];
            newPhotos.splice(index, 1);
            setPhotos(newPhotos);
        }
    };

    const handleSave = async () => {
        console.log('photos: %o', photos);

        try {
            let hasError = false;

            if (trail === '') {
                setTrailInputError(true);
                hasError = true;
            } else {
                setTrailInputError(false);
            }

            if (dateOfHike === null) {
                setDateOfHikeInputError(true);
                hasError = true;
            } else {
                setDateOfHikeInputError(false);
            }

            if (hasError) {
                setBanner('Some required fields are empty', 'error');
                SharedService.scrollToTop(topOfPageRef);

                return;
            } else {
                setBanner('');
            }

            const hike: Hike = {trail, dateOfHike: dateOfHike || '', conditions, crowds, hikers, notes, link, tags, photos};

            if (hikeId) {
                await DataService.updateHike(hike);
            } else {
                await DataService.createHike(hike);
            }

            navigate(`/hike/${hike.id}`);
        } catch (error) {
            setBanner('Error saving hike', 'error');
            SharedService.scrollToTop(topOfPageRef);
        }
    };

    return (
        <Box className={cx(classes.content)}>
            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Trail*'
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
                        label='Date of hike*'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DatePicker
                                    value={dateOfHike}
                                    onChange={(newValue) => setDateOfHike(newValue || null) }
                                    renderInput={(params) => <TextField {...params} size='small' error={dateOfHikeInputError}
                                    />}
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
                                    <TextField {...params} />
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
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setLink(event.target.value)}
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
                                value={notes}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                multiline={true}
                                rows={6}
                                onChange={(event) => setNotes(event.target.value)}
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
                        slotProps={{ typography: {variant: 'body2'} }}
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
                                    <TextField {...params} />
                                )}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <FormControl className={cx(classes.photosField)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Photos'
                        classes={{ label: classes.fieldLabel }}
                        slotProps={{ typography: {variant: 'body2'} }}
                        control={
                            <>
                                <input
                                    type='file'
                                    id='FileUpload'
                                    name='file'
                                    className={classes.fileUploadInput}
                                    onChange={handleSelectFile}
                                    accept='image/*'
                                />
                                <label htmlFor='FileUpload'>
                                    <Button component='span'>Browse</Button>
                                </label>
                            </>
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12}>
                <List className={cx(classes.photosList)} disablePadding={true}>
                    {
                        photos.map((photo: Photo) => (
                            <ListItem key={photo.fileName}>
                                <Typography variant='body2' className={cx(classes.photoFileName)}>{SharedService.getFileNameForPhoto(photo)}</Typography>

                                <FormControl className={cx(classes.photoCaptionField)}>
                                    <FormControlLabel
                                        label='Caption'
                                        labelPlacement='start'
                                        className={cx(classes.photoCaptionLabel)}
                                        slotProps={{ typography: {variant: 'body2'} }}
                                        control={
                                            <>
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
                                                <TextField
                                                    value={photo.caption}
                                                    size='small'
                                                    onChange={(event) => handleUpdatePhotoCaption(photo.fileName, event.target.value)}
                                                />
                                            </>
                                        }
                                    />
                                </FormControl>
                            </ListItem>
                        ))
                    }
                </List>
            </Grid>

            <Grid item xs={12} className={cx(classes.actions)}>
                <Button onClick={handleSave} variant='contained' color='primary'>Save</Button>
            </Grid>
        </Box>
    )
};

export default EditHike;
