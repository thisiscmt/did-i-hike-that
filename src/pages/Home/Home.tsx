import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TextField, Box, Typography, Button, InputAdornment, IconButton, Pagination, Popover } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { makeStyles } from 'tss-react/mui';

import SearchResult from '../../components/SearchResult/SearchResult';
import LoadingOverlay from '../../components/LoadingOverlay/LoadingOverlay';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';
import * as Constants from '../../constants/constants';
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

        [theme.breakpoints.down(Constants.HOME_PAGE_FIRST_BREAKPOINT)]: {
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

        [theme.breakpoints.down(Constants.HOME_PAGE_FIRST_BREAKPOINT)]: {
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

        [theme.breakpoints.down(Constants.HOME_PAGE_FIRST_BREAKPOINT)]: {
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
    const { searchText, searchResults, pageCount, isLoggedIn, setSearchText, setSearchResults, setPageCount, setBanner } = useContext(MainContext);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ initialLoad, setInitialLoad ] = useState<boolean>(true);
    const [ needLoad, setNeedLoad ] = useState<boolean>(false);
    const [ currentPage, setCurrentPage ] = useState<number>(1);
    const [ currentQueryString, setCurrentQueryString ] = useState<string>('');
    const [ noResults, setNoResults ] = useState<boolean>(false);
    const [ anchorEl, setAnchorEl ] = React.useState<HTMLButtonElement | null>(null);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const navigate = useNavigate();

    const handleSearch = useCallback(async (searchParamsArg: URLSearchParams) => {
        try {
            setLoading(true);
            setBanner('');

            const searchParams = SharedService.getSearchRequestParams(searchParamsArg);
            const hikes = await DataService.getHikes(searchParams);
            const pageSizeStr = searchParamsArg.get('pageSize');
            const pageSize = Number(pageSizeStr) === 0 ? PAGE_SIZE : Number(pageSizeStr);

            if (searchParams.page !== undefined) {
                setCurrentPage(searchParams.page);
            }

            setSearchResults(hikes.rows);
            setCurrentQueryString(searchParamsArg.toString());
            setPageCount(Math.ceil(hikes.count / pageSize));
            setNoResults(hikes.rows.length === 0);
            setNeedLoad(false);
        } catch (error){
            setBanner('Error occurred retrieving hikes', 'error');
        } finally {
            setLoading(false);
        }
    }, [setSearchResults, setPageCount, setBanner]);

    useEffect(() => {
        const getHikes = async () => {
            await handleSearch(searchParams);
        }

        document.title = 'Did I Hike That?';

        const queryStringChanged = currentQueryString !== searchParams.toString();

        if (((initialLoad && !searchResults) || needLoad || queryStringChanged) && isLoggedIn()) {
            setInitialLoad(false);
            getHikes();
        }
    }, [searchParams, currentQueryString, initialLoad, searchResults, needLoad, isLoggedIn, handleSearch]);

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleClearSearchText = () => {
        setSearchText('');
        setNeedLoad(true);
        searchParams.delete('searchText');
    };

    const handleClickSearch = () => {
        if (searchText) {
            searchParams.set('searchText', encodeURIComponent(searchText));
        } else {
            searchParams.delete('searchText');
        }

        if (currentPage !== 1) {
            searchParams.set('page', '1');
            setCurrentPage(1);
        }

        setSearchParams(searchParams);
        handleSearch(searchParams);
    };

    const handleKeypress = (event: React.KeyboardEvent<unknown>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleClickSearch();
        }
    };

    const handleChangePage = (_event: React.ChangeEvent<unknown>, value: number) => {
        searchParams.set('page', value.toString());

        setCurrentPage(value);
        setNeedLoad(true);
        setSearchParams(searchParams);
    }

    const handleOpenSearchTips = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleCloseSearchTips = () => {
        setAnchorEl(null);
    };

    const searchResultsToRender = searchResults || [];

    return (
        <Box className={classes.mainContainer}>
            <Box className={cx(classes.intro)}>
                <Typography variant='h5'>
                    Ever ask yourself if you've hiked a particular trail before?
                </Typography>
                <Typography variant='h5'>
                    Well ask no more.
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
                        <Button color='primary' variant='outlined' onClick={handleClickSearch}>Search</Button>
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
                        <Box className={cx(classes.searchTipContent)} onClick={handleCloseSearchTips}>
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
                            searchResultsToRender.length > 0
                                ?
                                    <>
                                        <Box className={cx(classes.searchResults)}>
                                            {
                                                searchResultsToRender.map((hike: Hike) => {
                                                    return (
                                                        <Box key={hike.id} className={cx(classes.searchResult)} onClick={() => navigate(`/hike/${hike.id}`)}>
                                                            <SearchResult hike={hike} />
                                                        </Box>
                                                    )
                                                })
                                            }
                                        </Box>

                                        <Pagination onChange={handleChangePage} page={currentPage} count={pageCount} className={cx(classes.pagination)} />
                                    </>
                                :
                                    <>
                                        {
                                            isLoggedIn() && noResults &&
                                            <Box className={cx(classes.noResults)}>No hikes found</Box>
                                        }
                                    </>
                        }
                    </Box>
                </form>

                <LoadingOverlay open={loading} />
            </Box>
        </Box>
    )
};

export default Home;
