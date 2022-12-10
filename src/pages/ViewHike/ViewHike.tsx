import React, {useEffect} from 'react';
import {Box} from '@mui/material';

const ViewHike = () => {
    useEffect(() => {
        document.title = 'View Hike - Did I Hike That?';
    });

    return (
        <Box>
            View hike
        </Box>
    )
};

export default ViewHike;
