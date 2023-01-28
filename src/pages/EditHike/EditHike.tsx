import React, {useEffect, useState} from 'react';
import {Box, Button, FormControl, FormControlLabel, Grid, TextField} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import {Photo} from '../../models/models';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterLuxon} from '@mui/x-date-pickers/AdapterLuxon';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
//        border: '1px solid red',
//        display: 'flex',
//        justifyContent: 'center',
//        width: '600px'
    },

    field: {
        marginBottom: '24px'
    },

    formControl: {
        width: '500px'
    },

    textFieldLabel: {
//        marginRight: '8px',
        minWidth: '100px',
//        textAlign: 'left'
    },




    actions: {
        marginTop: '24px'
    }
}));

const EditHike = () => {
    const { classes, cx } = useStyles();
    const [ trail, setTrail ] = useState<string>('');
    const [ dateOfHike, setDateOfHike ] = useState<string | null>(null);
    const [ conditions, setConditions ] = useState<string>('');
    const [ crowds, setCrowds ] = useState<string>('');
    const [ hikers, setHikers ] = useState<string[]>([]);
    const [ description, setDescription ] = useState<string>('');
    const [ link, setLink ] = useState<string>('');
    const [ tags, setTags ] = useState<string[]>([]);
    const [ photos, setPhotos ] = useState<Photo[]>([]);

    useEffect(() => {
        document.title = 'Edit Hike - Did I Hike That?';
    });

    const handleSave = () => {
        console.log('%o, %o, %o, %o', trail, dateOfHike, conditions, crowds);
    }

    return (
        <Box className={cx(classes.mainContainer)}>
            <Grid item xs={12} className={cx(classes.field)}>
                <FormControl className={cx(classes.formControl)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Trail:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <TextField
                                id='Trail'
                                name='Trail'
                                margin='none'
                                variant='outlined'
                                value={trail}
                                size='small'
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setTrail(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.field)}>
                {/*<LocalizationProvider dateAdapter={AdapterLuxon}>*/}
                {/*    <DatePicker*/}
                {/*        value={dateOfHike}*/}
                {/*        onChange={(newValue) => {*/}
                {/*            setDateOfHike(newValue || '');*/}
                {/*        }}*/}
                {/*        renderInput={(params) => <TextField {...params} size='small' />}*/}
                {/*    />*/}
                {/*</LocalizationProvider>*/}

                <FormControl className={cx(classes.formControl)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Date of hike:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <LocalizationProvider dateAdapter={AdapterLuxon}>
                                <DatePicker
                                    value={dateOfHike}
                                    onChange={(newValue) => {
                                        setDateOfHike(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} size='small' />}
                                />
                            </LocalizationProvider>
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.field)}>
                <FormControl className={cx(classes.formControl)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Conditions:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <TextField
                                id='Conditions'
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

            <Grid item xs={12} className={cx(classes.field)}>
                <FormControl className={cx(classes.formControl)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Crowds:'
                        classes={{ label: classes.textFieldLabel }}
                        control={
                            <TextField
                                id='Crowds'
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

            <Grid item xs={12} className={cx(classes.actions)}>
                <Button onClick={handleSave} variant='contained' color='primary'>Save</Button>
            </Grid>
        </Box>
    )
};

export default EditHike;
