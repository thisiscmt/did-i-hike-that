import React, {FC, useContext, useState} from 'react';
import {TextField, Box, InputLabel, Typography, Button} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import * as DataService from '../../services/dataService';
import {MainContext} from '../../contexts/MainContext';
import {Hike} from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    searchContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyItems: 'center'
    },

    quote: {
        fontStyle: 'italic'
    }
}));

const Home: FC = () => {
    const { classes, cx } = useStyles();
    const { searchText, setSearchText } = useContext(MainContext);
    const [ hikes, setHikes ] = useState<Hike[]>([]);

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleSearch = async () => {
        const hikes = await DataService.getHikes();

        console.log('hikes: %o', hikes);

        setHikes(hikes.rows);
    };

    return (
        <>
            <Box>
                <Typography variant='body2'>
                    Ever wonder if you hiked a particular trail? Well wonder no more!
                </Typography>

                <Typography variant='body2'>
                    <span className={cx(classes.quote)}>Not all those who wander are lost</span> - J.R.R. Tolkien
                </Typography>

                <Box className={cx(classes.searchContainer)}>
                    <InputLabel>Search</InputLabel>
                    <TextField onChange={handleSearchTextChange} value={searchText} />

                    <Button color='primary' onClick={handleSearch}>Search</Button>
                </Box>
            </Box>

            <br />

            <Box>
                {
                    hikes.map((hike: Hike) => {
                        return `${hike.trail}, ${hike.description}, ${hike.hikers}, ${hike.conditions}, ${hike.tags} `;
                    })
                }
            </Box>
        </>
    )
};

export default Home;
