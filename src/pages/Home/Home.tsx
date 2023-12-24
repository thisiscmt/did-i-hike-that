import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Box, Typography, Button, InputAdornment, IconButton, Pagination, Popover } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';
import Axios from 'axios';

import SearchResult from '../../components/SearchResult/SearchResult';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import { MainContext } from '../../contexts/MainContext';
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

    searchControls: {
        display: 'grid',
        gridTemplateColumns: '1fr repeat(1, auto) 1fr',
        justifyItems: 'center',
        margin: 'auto',
        width: '80%',

        '& button:nth-child(1)': {
            gridColumnStart: 2
        },

        '& button:nth-child(2)': {
            marginLeft: 'auto'
        },

        [theme.breakpoints.down(700)]: {
            width: '100%'
        }
    },

    searchTipsButton: {
        fontSize: '12px'
    },

    searchTipContent: {
        marginLeft: '16px',
        marginRight: '16px',
        width: '400px',

        [theme.breakpoints.down(465)]: {
            width: 'auto'
        }
    },

    searchResultsContainer: {
        marginTop: '24px',
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
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Did I Hike That?';
    })

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

    const handleOpenSearchTips = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseSearchTips = () => {
        setAnchorEl(null);
    };

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

                    <Box className={cx(classes.searchControls)}>
                        <Button color='primary' variant='outlined' onClick={() => handleSearch()}>Search</Button>
                        <Button variant='text' size='small' className={cx(classes.searchTipsButton)} onClick={handleOpenSearchTips}>Search Tips</Button>
                    </Box>

                    <Popover
                        open={Boolean(anchorEl)}
                        onClose={handleCloseSearchTips}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        <Box className={cx(classes.searchTipContent)}>
                            <p>
                                You can search for any text that is in the trail name, notes, hikers, or tags. To search by the start date of the
                                hike, prefix your search text with 'date:' and then type in a date value in the form mm/dd/yyyy.
                            </p>

                            <p>
                                To search by date range, type in 'date:' then a value in the form mm/dd/yyyy - mm/dd/yyyy. To see all hikes, click Search
                                without any search text.
                            </p>
                        </Box>
                    </Popover>

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
