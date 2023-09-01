import React, { FC, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {TextField, Box, Typography, Button, InputAdornment, IconButton, Pagination} from '@mui/material';
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
    mainContainer: {
        textAlign: 'center'
    },

    intro: {
        marginBottom: '30px',

        '& .MuiTypography-root': {
            marginBottom: '20px'
        }
    },

    quote: {
        fontStyle: 'italic'
    },

    searchInputContainer: {
        marginBottom: '10px'
    },

    searchInput: {
        width: '80%',

        [theme.breakpoints.down(700)]: {
            width: '100%'
        }
    },

    searchResultsContainer: {
        marginTop: '16px',
        textAlign: 'left'
    },

    searchResults: {
        margin: 'auto',
        width: '80%',

        [theme.breakpoints.down(700)]: {
            width: '100%'
        }
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

    pagination: {
        '& .MuiPagination-ul': {
            justifyContent: 'center'
        }
    }
}));

const PAGE_SIZE = 10;

const Home: FC = () => {
    const { classes, cx } = useStyles();
    const { searchText, searchResults, page, pageCount, setSearchText, setSearchResults, setPage, setPageCount, setBanner } = useContext(MainContext);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ showResults, setShowResults ] = useState<boolean>(searchResults.length > 0);
    const navigate = useNavigate();

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleClearSearchText = () => {
        setSearchText('');
        handleSearch(undefined, true);
    };

    const handleSearch = async (page?: number, clearSearch?: boolean) => {
        try {
            setLoading(true);
            setBanner('');

            const searchParams = SharedService.getSearchParams(clearSearch ? '' : searchText);
            searchParams.page = page || 1;
            searchParams.pageSize = PAGE_SIZE;
            const hikes = await DataService.getHikes(searchParams);

            if (!clearSearch) {
                setSearchText(searchText);
            }

            setSearchResults(hikes.rows);
            setPageCount(Math.ceil(hikes.count / PAGE_SIZE));
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

    const handleKeypress = (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        handleSearch(value);
    }

    console.log('searchText: %o', searchText);

    return (
        <Box className={classes.mainContainer}>
            <Box className={cx(classes.intro)}>
                <Typography variant='h5'>
                    Ever ask yourself if you've hiked a particular trail before?
                </Typography>
                <Typography variant='h5'>
                    Well ask no more!
                </Typography>
                <Typography variant='body1' className={cx(classes.quote)}>
                    "Not all those who wander are lost"
                </Typography>
            </Box>

            <Box className='loadable-container'>
                <form>
                    <Box className={cx(classes.searchInputContainer)}>
                        <TextField
                            onChange={handleSearchTextChange}
                            value={searchText}
                            className={cx(classes.searchInput)}
                            fullWidth={true}
                            inputProps={{
                                onKeyPress: handleKeypress
                            }}
                            InputProps={ searchText ?
                                {
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="clear search input"
                                                onClick={handleClearSearchText}
                                                title='Clear search text'
                                                type='submit'
                                            >
                                                <CloseOutlined />
                                            </IconButton>
                                        </InputAdornment>
                                } : undefined
                            }
                        />
                    </Box>

                    <Box>
                        <Button color='primary' onClick={() => handleSearch()}>Search</Button>
                    </Box>

                    <Box className={`${cx(classes.searchResultsContainer)}`}>
                        {
                            showResults
                                ?
                                searchResults.length > 0
                                    ?
                                    <>
                                        <Box className={cx(classes.searchResults)}>
                                            {
                                                searchResults.map((hike: Hike) => {
                                                    return (
                                                        <Box key={hike.id} className={cx(classes.searchResult)} onClick={() => navigate(`/hike/${hike.id}`)}>
                                                            <SearchResult hike={hike} />
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>

                                        <Pagination onChange={handleChangePage} page={page} count={pageCount} className={cx(classes.pagination)} />
                                    </>
                                    :
                                    <Box className={cx(classes.noResults)}>No hikes found</Box>
                                : ''
                        }
                    </Box>
                </form>

                <LoadingOverlay open={loading} />
            </Box>
        </Box>
    )
};

export default Home;
