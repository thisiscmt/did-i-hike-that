import React from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router';
import { makeStyles } from 'tss-react/mui';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { BlueAnchorStyles } from '../../services/themeService';

const useStyles = makeStyles()(() => ({
    link: {
        ...BlueAnchorStyles
    },
}));

const ErrorPage = () => {
    const { classes, cx } = useStyles();
    const navigate = useNavigate();

    useDocumentTitle('Error - Did I Hike That?');

    const handleGoBack = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        navigate(-1);
    };

    return (
        <Box>
            <p>Sometimes those who wonder are indeed lost.</p>

            <p>I'm afraid the page you are trying to reach can't be found.</p>

            <p>
                Maybe <a href='#' className={cx(classes.link)} onClick={handleGoBack}>go back</a>?
            </p>
        </Box>
    )
};

export default ErrorPage;
