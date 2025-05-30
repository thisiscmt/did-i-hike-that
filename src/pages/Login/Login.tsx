import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { VisibilityOffOutlined, VisibilityOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import { DateTime } from 'luxon';

import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { MainContext } from '../../contexts/MainContext';
import * as DataService from '../../services/dataService';
import * as Constants from '../../constants/constants';

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

    passwordVisibility: {
        marginRight: '6px',

        '& svg': {
            height: '18px',
            width: '18px'
        }
    },

    actions: {
        marginTop: '24px'
    }
}));

const Login = () => {
    const { classes, cx } = useStyles();

    const [ email, setEmail ] = useState<string>(localStorage.getItem(Constants.STORAGE_EMAIL) || '');
    const [ password, setPassword ] = useState<string>('');
    const [ showPassword, setShowPassword ] = useState<boolean>(false);
    const [ lastLogin, setLastLogin ] = useState<string>(localStorage.getItem(Constants.STORAGE_LAST_LOGIN) || '');
    const [ emailInputError, setEmailInputError ] = useState<boolean>(false);
    const [ passwordInputError, setPasswordInputError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const { setBanner, handleException } = useContext(MainContext);
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();

    useDocumentTitle('Login - Did I Hike That?');

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

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
            setLoading(true);
            const user = await DataService.login(email, password);

            const lastLogin = Date.now().toString();
            setLastLogin(lastLogin);
            setPassword('');

            localStorage.setItem(Constants.STORAGE_EMAIL, email);
            localStorage.setItem(Constants.STORAGE_FULL_NAME, user.fullName || '');
            localStorage.setItem(Constants.STORAGE_ROLE, user.role);
            localStorage.setItem(Constants.STORAGE_LAST_LOGIN, lastLogin);

            const returnUrlParam = searchParams.get('returnUrl');
            let returnUrl = '/';

            if (returnUrlParam) {
                returnUrl = decodeURIComponent(returnUrlParam);
                window.location.replace(`${window.location.origin}${returnUrl}`);
            } else {
                navigate(returnUrl);
            }
        } catch (error) {
            handleException(error, 'An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const formattedLastLogin = lastLogin ? 'Last login on ' + DateTime.fromMillis(Number(lastLogin)).toLocaleString(DateTime.DATETIME_FULL) : '';

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
                                margin='none'
                                variant='outlined'
                                value={email}
                                type='email'
                                autoComplete='email'
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
                                type={ showPassword ? 'text' : 'password'}
                                size='small'
                                error={passwordInputError}
                                fullWidth={true}
                                autoCorrect='off'
                                inputProps={{ maxLength: 255 }}
                                onChange={(event) => setPassword(event.target.value)}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end" className={classes.passwordVisibility}>
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleShowPassword}
                                                size='small'
                                            >
                                                {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
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

            <LoadingOverlay open={loading} />
        </>
    )
};

export default Login;
