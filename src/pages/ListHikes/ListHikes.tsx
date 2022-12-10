import React, {useEffect} from 'react';
import {Box} from '@mui/material';

const ListHikes = () => {
    useEffect(() => {
        document.title = 'Hikes - Did I Hike That?';
    });

    return (
        <Box>
            List hikes
        </Box>
    )
}

export default ListHikes;
