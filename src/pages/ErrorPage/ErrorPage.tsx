import React from 'react';
import { Box } from '@mui/material';

import useDocumentTitle from '../../hooks/useDocumentTitle';

const ErrorPage = () => {
    useDocumentTitle('Error - Did I Hike That?');

    return (
        <Box>
            <p>Sometimes those who wonder are indeed lost.</p>

            <p>I'm afraid the page you are trying to reach is not here.</p>
        </Box>
    )
};

export default ErrorPage;
