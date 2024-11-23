import React, {useEffect} from 'react';
import {Box} from '@mui/material';

const ErrorPage = () => {
    useEffect(() => {
        document.title = '404 - Did I Hike That?';
    });

    return (
        <Box>
            <p>Sometimes those who wonder are indeed lost.</p>

            <p>I'm afraid the page you are trying to reach is not here.</p>
        </Box>
    )
};

export default ErrorPage;
