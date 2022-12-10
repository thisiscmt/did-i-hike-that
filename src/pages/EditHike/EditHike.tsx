import React, {useEffect} from 'react';
import {Box} from '@mui/material';

const EditHike = () => {
    useEffect(() => {
        document.title = 'Edit Hike - Did I Hike That?';
    });

    return (
        <Box>
            Edit hike
        </Box>
    )
};

export default EditHike;
