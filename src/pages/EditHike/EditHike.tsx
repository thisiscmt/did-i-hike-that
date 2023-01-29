import React, {useContext, useEffect, useState} from 'react';
import {Autocomplete, AutocompleteChangeDetails, Box, Button, FormControl, FormControlLabel, Grid, TextField} from '@mui/material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';
import { makeStyles } from 'tss-react/mui';

import * as DataService from '../../services/dataService';
import {Hike, Photo} from '../../models/models';
import {MainContext} from '../../contexts/MainContext';

const useStyles = makeStyles()((theme) => ({
    content: {
    },

    row: {
        marginBottom: '24px'
    },

    field: {
        width: '500px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
        }
    },

    wideField: {
        width: '650px',

        '& .MuiFormControlLabel-root': {
            marginLeft: 0,
            marginRight: 'initial'
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

    textFieldLabel: {
        minWidth: '120px',
    },

    multilineTextField: {
        '& .MuiFormControlLabel-root': {
            alignItems: 'flex-start'
        }
    },

    actions: {
        marginTop: '24px'
    }
}));

const EditHike = () => {
    const { classes, cx } = useStyles();
    const [ trail, setTrail ] = useState<string>('');
    const [ dateOfHike, setDateOfHike ] = useState<string>('');
    const [ conditions, setConditions ] = useState<string>('');
    const [ crowds, setCrowds ] = useState<string>('');
    const [ knownHikers, setKnownHikers ] = useState<string[]>([]);
    const [ hikers, setHikers ] = useState<string[]>([]);
    const [ notes, setNotes ] = useState<string>('');
    const [ link, setLink ] = useState<string>('');
    const [ tags, setTags ] = useState<string[]>([]);
    const [ photos, setPhotos ] = useState<Photo[]>([]);
    const [ retrievedKnownHikers, setRetrievedKnownHikers ] = useState<boolean>(false);
    const { setBannerMessage, setBannerSeverity } = useContext(MainContext);

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

        document.title = 'Edit Hike - Did I Hike That?';

        if (!retrievedKnownHikers) {
            getKnownHikers();
        }
    });

    const handleChangeHikers = (event: React.SyntheticEvent, value: string[], reason: string, details?: AutocompleteChangeDetails<string> | undefined) => {
        if (reason === 'createOption') {
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

    const handleSave = () => {
        try {
            const hike: Hike = {
                trail,
                dateOfHike,
                conditions,
                crowds,
                hikers,
                notes,
                link,
                tags,
                photos
            };

            DataService.createHike(hike);
        } catch (error) {
            setBannerSeverity('error');
            setBannerMessage('Error retrieving known hikers')
        }
    };

    return (
        <Box className={cx(classes.content)}>
            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Trail:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <TextField
                                name='Trail'
                                margin='none'
                                variant='outlined'
                                value={trail}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                required={true}
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
                        label='Date of hike:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DatePicker
                                    value={dateOfHike}
                                    onChange={(newValue) => setDateOfHike(newValue || '') }
                                    renderInput={(params) => <TextField {...params} size='small' />}
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
                        label='Conditions:'
                        classes={{ label: classes.textFieldLabel }}
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
                        label='Crowds:'
                        classes={{ label: classes.textFieldLabel }}
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
                        label='Hikers:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <Autocomplete
                                multiple={true}
                                freeSolo={true}
                                options={knownHikers || []}
                                getOptionLabel={(option) => option}
                                defaultValue={[]}
                                fullWidth={true}
                                size='small'
                                onChange={handleChangeHikers}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
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
                        label='Link:'
                        classes={{ label: classes.textFieldLabel }}
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
                        label='Notes:'
                        classes={{ label: classes.textFieldLabel }}
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
                                rows={4}
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
                        label='Tags:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <Autocomplete
                                multiple={true}
                                freeSolo={true}
                                options={[]}
                                getOptionLabel={(option) => option}
                                defaultValue={[]}
                                fullWidth={true}
                                size='small'
                                onChange={handleChangeTags}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                    />
                                )}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.actions)}>
                <Button onClick={handleSave} variant='contained' color='primary'>Save</Button>
            </Grid>
        </Box>
    )
};

export default EditHike;
