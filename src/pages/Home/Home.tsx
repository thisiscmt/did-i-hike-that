import React, {FC, useContext, useState} from 'react';
import {TextField, Box, Typography, Button} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import SearchResult from '../../components/SearchResult/SearchResult';
import * as DataService from '../../services/dataService';
import {MainContext} from '../../contexts/MainContext';
import {Hike, HikeSearchParams} from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '20px',
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
        marginTop: '10px'
    },

    searchInput: {
        width: '400px'
    },

    searchResultsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '20px'
    },

    searchResults: {
        margin: 'auto',
        width: '700px'
    },

    searchResult: {
        marginBottom: '30px',

        ':last-child': {
            marginBottom: 0
        }
    }
}));

const Home: FC = () => {
    const { classes, cx } = useStyles();
    const { searchText, hikes, setSearchText, setHikes } = useContext(MainContext);
    const [ showResults, setShowResults ] = useState<boolean>(false);

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleSearch = async () => {
        const searchParams: HikeSearchParams = {};
        let index: number;

        if (searchText) {
            if (searchText.toLowerCase().startsWith('date:')) {
                index = searchText.indexOf('-');

                if (index > -1) {
                    searchParams.startDate = searchText.slice(5, index).trim();
                    searchParams.endDate = searchText.slice(index + 1).trim();
                } else {
                    searchParams.startDate = searchText.slice(5).trim();
                }
            } else {
                searchParams.searchText = searchText
            }
        }

        console.log('searchParams: %o', searchParams);

        const hikes = await DataService.getHikes(searchParams);
        setSearchText(searchText);
        setHikes(hikes.rows);
        setShowResults(true);
    };

    return (
        <>
            <Box className={cx(classes.content)}>
                <Typography variant='h5'>
                    Ever wonder if you hiked a particular trail? Well wonder no more!
                </Typography>

                <Typography variant='body1'>
                    <span className={cx(classes.quote)}>Not all those who wander are lost</span> - J.R.R. Tolkien
                </Typography>

                <Box className={cx(classes.searchInputContainer)}>
                    <TextField onChange={handleSearchTextChange} value={searchText} className={cx(classes.searchInput)} />
                </Box>

                <Box>
                    <Button color='primary' onClick={handleSearch}>Search</Button>
                </Box>
            </Box>

            <Box className={cx(classes.searchResultsContainer)}>
                {
                    showResults ?
                        hikes.length > 0
                            ?
                                <Box className={cx(classes.searchResults)}>
                                    {
                                        hikes.map((hike: Hike) => {
                                            return (
                                                <Box key={hike.id} className={cx(classes.searchResult)}>
                                                    <SearchResult hike={hike} />
                                                </Box>
                                            )
                                        })
                                    }
                                </Box> : 'No hikes found'
                            : ''
                }
            </Box>
        </>
    )
};

export default Home;
