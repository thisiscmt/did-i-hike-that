import React, {useEffect} from 'react';
import {Box} from '@mui/material';

const ErrorPage = () => {
    useEffect(() => {
        document.title = 'Error - Did I Hike That?';
    });

    return (
        <Box>
            <p>The page you are trying to reach can't be found</p>
        </Box>
    )
};

export default ErrorPage;
