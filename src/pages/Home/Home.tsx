import React, { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button, InputAdornment, IconButton} from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import SearchResult from '../../components/SearchResult/SearchResult';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import {MainContext} from '../../contexts/MainContext';
import { Hike } from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',

        '& .MuiTypography-root': {
            marginBottom: '20px'
        }
    },

    quote: {
        fontStyle: 'italic'
    },

    searchInputContainer: {
        marginBottom: '10px',
        marginTop: '10px',
    },

    searchInput: {
        width: '500px',

        [theme.breakpoints.down(700)]: {
            width: '300px'
        },

        [theme.breakpoints.down(470)]: {
            width: '80%'
        },
    },

    searchResultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '16px'
    },

    searchResults: {
        margin: 'auto',
        width: '700px',

        [theme.breakpoints.down(1024)]: {
            width: '500px'
        },

        [theme.breakpoints.down(700)]: {
            width: '80%'
        },
    },

    searchResult: {
        cursor: 'pointer',
        marginBottom: '30px',

        ':last-child': {
            marginBottom: '20px'
        }
    },

    noResults: {
        textAlign: 'center'
    },

}));

const Home: FC = () => {
    const { classes, cx } = useStyles();
    const { searchText, hikes, setSearchText, setHikes, setBanner } = useContext(MainContext);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ showResults, setShowResults ] = useState<boolean>(hikes.length > 0);
    const navigate = useNavigate();

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleClearSearchText = () => {
        setSearchText('');
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            setBanner('');
            const searchParams = SharedService.getSearchParams(searchText);
            const hikes = await DataService.getHikes(searchParams);

            setSearchText(searchText);
            setHikes(hikes.rows);
            setShowResults(true);
        } catch (error){
            if (Axios.isAxiosError(error) && error.response?.status === 401) {
                setBanner('You need to log in', 'warning');
            } else {
                setBanner('Error occurred retrieving hikes', 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box className='loadable-container'>
            <Box className={cx(classes.content)}>
                <Typography variant='h5'>
                    Ever ask yourself if you've hiked a particular trail before?
                </Typography>
                <Typography variant='h5'>
                    Well ask no more!
                </Typography>
                <Typography variant='body1' className={cx(classes.quote)}>
                    "Not all those who wander are lost"
                </Typography>

                <Box className={cx(classes.searchInputContainer)}>
                    <TextField
                        onChange={handleSearchTextChange}
                        value={searchText}
                        className={cx(classes.searchInput)}
                        fullWidth={true}
                        InputProps={ searchText ?
                            {
                                endAdornment:
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="clear search input"
                                            onClick={handleClearSearchText}
                                            title='Clear search text'
                                        >
                                            <CloseOutlined />
                                        </IconButton>
                                    </InputAdornment>
                            } : undefined
                        }
                    />
                </Box>

                <Box>
                    <Button color='primary' onClick={handleSearch}>Search</Button>
                </Box>
            </Box>

            <Box className={`${cx(classes.searchResultsContainer)}`}>
                {
                    showResults ?
                        hikes.length > 0
                            ?
                                <Box className={cx(classes.searchResults)}>
                                    {
                                        hikes.map((hike: Hike) => {
                                            return (
                                                <Box key={hike.id} className={cx(classes.searchResult)} onClick={() => navigate(`/hike/${hike.id}`)}>
                                                    <SearchResult hike={hike} />
                                                </Box>
                                            )
                                        })
                                    }
                                </Box> : <Box className={cx(classes.noResults)}>No hikes found</Box>
                            : ''
                }
            </Box>

            <LoadingOverlay open={loading} />
        </Box>
    )
};

export default Home;
