import React, {useContext, useEffect, useState} from 'react';
import {Box, Button, FormControl, FormControlLabel, Grid, TextField, Typography} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import * as DataService from '../../services/dataService';
import { MainContext } from '../../contexts/MainContext';
import {STORAGE_EMAIL_KEY, STORAGE_LAST_LOGIN_KEY} from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    row: {
        marginBottom: '24px',

        [theme.breakpoints.down(540)]: {
            '& .MuiFormControlLabel-root': {
                flexDirection: 'column-reverse'
            },

            '&.linkLabelField': {
                marginBottom: '8px'
            }
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

        [theme.breakpoints.down(800)]: {
            width: '100%'
        }
    },

    fieldLabel: {
        fontSize: '14px',
        minWidth: '120px',

        [theme.breakpoints.down(540)]: {
            marginBottom: '4px',
            width: '100%'
        }
    },

    lastLogin: {
        fontSize: '12px',
        fontStyle: 'italic'
    },

    actions: {
        marginTop: '24px'
    }
}));

const Settings = () => {
    const { classes, cx } = useStyles();
    const { setBanner } = useContext(MainContext);
    const [ email, setEmail ] = useState<string>(localStorage.getItem(STORAGE_EMAIL_KEY) || '');
    const [ password, setPassword ] = useState<string>('');
    const [ lastLogin, setLastLogin ] = useState<string>(localStorage.getItem(STORAGE_LAST_LOGIN_KEY) || '');
    const [ emailInputError, setEmailInputError ] = useState<boolean>(false);
    const [ passwordInputError, setPasswordInputError ] = useState<boolean>(false);

    useEffect(() => {
        document.title = 'Settings - Did I Hike That?';
    });

    const handleLogin = async () => {
        try {
            if (!email.trim()) {
                setEmailInputError(true);
                setBanner('A required field is empty', 'error');
                return;
            } else {
                setEmailInputError(false);
            }

            if (!password.trim()) {
                setPasswordInputError(true);
                setBanner('A required field is empty', 'error');
                return;
            } else {
                setPasswordInputError(false);
            }

            setBanner('');
            await DataService.loginUser(email, password);

            const lastLogin = Date.now().toString();
            setLastLogin(lastLogin);
            localStorage.setItem(STORAGE_EMAIL_KEY, email);
            localStorage.setItem(STORAGE_LAST_LOGIN_KEY, lastLogin);
        } catch (error) {
            if (Axios.isAxiosError(error)) {
                setBanner('Email address or password was invalid', 'error');
            } else {
                setBanner('Error occurred during login', 'error');
            }
        }
    };

    const formattedLastLogin = lastLogin ? 'Last login: ' + new Date(Number(lastLogin)).toLocaleString() : '';

    return (
        <>
            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Email *'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Email'
                                margin='none'
                                variant='outlined'
                                value={email}
                                size='small'
                                error={emailInputError}
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            <Grid item xs={12} className={cx(classes.row)}>
                <FormControl className={cx(classes.field)}>
                    <FormControlLabel
                        labelPlacement='start'
                        label='Password *'
                        classes={{ label: classes.fieldLabel }}
                        control={
                            <TextField
                                name='Password'
                                margin='none'
                                variant='outlined'
                                value={password}
                                type='password'
                                size='small'
                                error={passwordInputError}
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        }
                    />
                </FormControl>
            </Grid>

            {
                lastLogin &&
                <Typography variant='body2' className={cx(classes.lastLogin)}>{formattedLastLogin}</Typography>
            }

            <Grid item xs={12} className={cx(classes.actions)}>
                <Button onClick={handleLogin} variant='contained' color='primary'>Login</Button>
            </Grid>
        </>
    )
};

export default Settings;
