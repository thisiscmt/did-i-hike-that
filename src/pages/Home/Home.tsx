import React, {FC} from 'react';
import {TextField, Box, InputLabel, Typography} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

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

    return (
        <Box>
            <Typography variant='body2'>
                Ever wonder if you hiked a particular trail? Well wonder no more!
            </Typography>

            <Typography variant='body2'>
                <span className={cx(classes.quote)}>Not all those who wander are lost</span> - J.R.R. Tolkien
            </Typography>

            <Box className={cx(classes.searchContainer)}>
                <InputLabel>Search</InputLabel>

                <TextField>

                </TextField>
            </Box>
        </Box>
    )
};

export default Home;
