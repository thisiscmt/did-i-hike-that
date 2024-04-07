import React, { FC, RefObject, useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControl, FormControlLabel, Grid, TextField, Select, MenuItem } from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import { MainContext } from '../../contexts/MainContext';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import ConfirmationPrompt from '../../components/ConfirmationPrompt/ConfirmationPrompt';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import * as Constants from '../../constants/constants';
import { Colors } from '../../services/themeService';
import { User } from '../../models/models';

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

    fieldLabel: {
        fontSize: '14px',
        minWidth: '120px',
        paddingRight: '16px',
        textAlign: 'right',

        [theme.breakpoints.down(470)]: {
            marginBottom: '4px',
            paddingRight: 0,
            textAlign: 'left',
            width: '100%'
        }
    },

    roleSelectorField: {
        width: '100%'
    },

    roleSelector: {
        width: '120px'
    },

    actions: {
        marginLeft: '136px',
        marginTop: '24px',

        [theme.breakpoints.down(470)]: {
            marginLeft: '0'
        }
    },

    buttonSpacer: {
        marginLeft: '12px'
    },

    saveIndicator: {
        color: Colors.white,
        position: 'absolute',
    }
}));

interface EditUserProps {
    topOfPageRef: RefObject<HTMLElement>;
}

const EditUser: FC<EditUserProps> = ({ topOfPageRef }) => {
    const { userId } = useParams();
    const dummyPassword = '********';

    const { classes, cx } = useStyles();
    const [ fullName, setFullName ] = useState<string>('');
    const [ email, setEmail ] = useState<string>('');
    const [ password, setPassword ] = useState<string>(userId ? dummyPassword : '');
    const [ role, setRole ] = useState<string>('');
    const [ passwordChanged, setPasswordChanged ] = useState<boolean>(false);
    const [ nameInputError, setNameInputError ] = useState<boolean>(false);
    const [ emailInputError, setEmailInputError ] = useState<boolean>(false);
    const [ passwordInputError, setPasswordInputError ] = useState<boolean>(false);
    const [ roleInputError, setRoleInputError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ authorized, setAuthorized ] = useState<boolean>(false);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ retrieveduser, setRetrievedUser ] = useState<boolean>(false);
    const [ openDeleteConfirmation, setOpenDeleteConfirmation ] = useState<boolean>(false);

    const { loggedIn, setBanner, setLoggedIn } = useContext(MainContext);
    const navigate = useNavigate();

    useEffect(() => {
        const setUserLoggedOut = () => {
            localStorage.removeItem(Constants.STORAGE_FULL_NAME);
            localStorage.removeItem(Constants.STORAGE_LAST_LOGIN);
            setLoggedIn(false);
            setBanner(Constants.LOGIN_REQUIRED_MESSAGE, 'warning');
        }

        const getUser = async () => {
            try {
                if (userId) {
                    setLoading(false);
                    const response = await DataService.getUser(userId);

                    setFullName(response.fullName || '');
                    setEmail(response.email);
                    setRole(response.role);
                    setAuthorized(true);
                    setRetrievedUser(true);
                }
            } catch (error) {
                if (Axios.isAxiosError(error) && error.response?.status === 401) {
                    setUserLoggedOut();
                } else if (Axios.isAxiosError(error) && error.response?.status === 403) {
                    setBanner('You are not authorized to view this page', 'warning');
                } else {
                    setBanner('Error occurred retrieving users', 'error');
                }
            } finally {
                setLoading(false);
            }
        }

        if (userId && !retrieveduser) {
            getUser();
        }
    }, [userId, retrieveduser, setLoggedIn, setBanner]);

    const validInput = () => {
        let valid = true;
        let errorMsg = '';

        if (fullName === '') {
            setNameInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            setNameInputError(false);
        }

        if (email === '') {
            setEmailInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            setEmailInputError(false);
        }

        if (password === '') {
            setPasswordInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            setPasswordInputError(false);
        }

        if (role === '') {
            setRoleInputError(true);
            errorMsg = 'A required field is empty';
            valid = false;
        } else {
            setRoleInputError(false);
        }

        if (valid) {
            setBanner('');
        } else {
            setBanner(errorMsg, 'error');
            SharedService.scrollToTop(topOfPageRef);
        }

        return valid;
    };

    const handleChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
        setPasswordChanged(true);
    }

    const handleSave = async () => {
        try {
            if (validInput()) {
                const user: User = {
                    fullName,
                    email,
                    password: (passwordChanged && password !== dummyPassword) ? password : '',
                    role
                };

                if (userId) {
                    user.id = userId;
                    await DataService.updateUser(user);
                } else {
                    await DataService.createUser(user);
                }

                setSaving(false);
                navigate('/admin');
            }
        } catch (error) {
            if (Axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    setBanner('You need to log in', 'warning');
                } else if (error.response?.status === 400) {
                    setBanner(error.response?.data, 'error');
                } else {
                    setBanner('Error saving user', 'error');
                }
            } else {
                setBanner('Error saving user', 'error');
            }

            SharedService.scrollToTop(topOfPageRef);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin');
    };

    const handleDeleteConfirmation = async (value: boolean) => {
        setOpenDeleteConfirmation(false);

        if (value && userId) {
            await DataService.deleteUser(userId);
            navigate('/admin');
        }
    };

    return (
        <Box className='loadable-container'>
            {
                !loading && loggedIn && (userId ? authorized : true) &&
                <>
                    <Grid item xs={12} className={cx(classes.row)}>
                        <FormControl className={cx(classes.field)}>
                            <FormControlLabel
                                labelPlacement='start'
                                label='Name *'
                                classes={{ label: classes.fieldLabel }}
                                control={
                                    <TextField
                                        name='Name'
                                        margin='none'
                                        variant='outlined'
                                        value={fullName}
                                        size='small'
                                        error={nameInputError}
                                        fullWidth={true}
                                        autoCorrect='off'
                                        inputProps={{ maxLength: 255 }}
                                        onChange={(event) => setFullName(event.target.value)}
                                    />
                                }
                            />
                        </FormControl>
                    </Grid>

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
                                        type='password'
                                        autoComplete='current-password'
                                        margin='none'
                                        variant='outlined'
                                        value={password}
                                        size='small'
                                        error={passwordInputError}
                                        fullWidth={true}
                                        autoCorrect='off'
                                        inputProps={{ maxLength: 255 }}
                                        onChange={handleChangePassword}
                                        onFocus={event => {
                                            event.target.select();
                                        }}
                                    />
                                }
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} className={cx(classes.row)}>
                        <FormControl className={cx(classes.field)} size='small'>
                            <FormControlLabel
                                labelPlacement='start'
                                label='Role *'
                                classes={{ label: classes.fieldLabel }}
                                control={
                                    <Box className={cx(classes.roleSelectorField)}>
                                        <Select
                                            value={role}
                                            error={roleInputError}
                                            className={cx(classes.roleSelector)}
                                            onChange={(event) => setRole(event.target.value)}
                                        >
                                            <MenuItem value='Standard'>Standard</MenuItem>
                                            <MenuItem value='Admin'>Admin</MenuItem>
                                        </Select>
                                    </Box>
                                }
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} className={cx(classes.actions)}>
                        <Button onClick={handleSave} variant='contained' color='primary' disabled={saving}>Save
                            {saving && (
                                <CircularProgress size={20} className={cx(classes.saveIndicator)} />
                            )}
                        </Button>

                        <Button onClick={handleCancel} variant='outlined' color='secondary' className={cx(classes.buttonSpacer)}>Cancel</Button>
                        <Button onClick={() => setOpenDeleteConfirmation(true)} variant='outlined' color='error' className={cx(classes.buttonSpacer)}>Delete</Button>
                    </Grid>
                </>
            }

            <ConfirmationPrompt
                title='Delete this user?'
                open={openDeleteConfirmation}
                content='Are you sure you want to delete this user?'
                onClose={handleDeleteConfirmation}
            />

            <LoadingOverlay open={loading} />
        </Box>
    );
};

export default EditUser;
