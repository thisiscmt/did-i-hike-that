import React, { FC } from 'react';
import {Box, Typography, Chip, Card, CardContent} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import {Hike} from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    card: {
        borderRadius: '6px',
        display: 'flex'
    },

    content: {
        display: 'flex',

        '&:last-child': {
            paddingBottom: '16px'
        },

        [theme.breakpoints.down(500)]: {
            flexDirection: 'column',
            width: 'unset'
        },
    },

    thumbnail: {
        width: '150px'
    },

    details: {
        marginLeft: '40px',

        '& .MuiChip-root': {
            marginRight: '8px'
        },

        '& .MuiChip-root:last-child': {
            marginRight: 0
        },

        [theme.breakpoints.down(700)]: {
            marginLeft: '20px'
        },

        [theme.breakpoints.down(500)]: {
            marginLeft: 0
        },
    },

    hikers: {
        marginTop: '10px'
    },

    description: {
        fontSize: '14px',
        marginTop: '10px',
        display: '-webkit-box',
        '-webkitLineClamp': '4',
        '-webkitBoxOrient': 'vertical',
        overflow: 'hidden'
    }
}));

interface SearchResultProps {
    hike: Hike;
}

const SearchResult: FC<SearchResultProps> = ({ hike }) => {
    const { classes, cx } = useStyles();
    const thumbnailSource = hike.filePath ? `${process.env.REACT_APP_API_URL}/images/` + hike.filePath : 'images/no_hike_images.png';
    const hikers = hike.fullNames?.split(',');

    const formatDateOfHike = () => {
        const dateParts = hike.dateOfHike.split('-');
        return `${Number(dateParts[1])}/${Number(dateParts[2])}/${dateParts[0]}`;
    };

    return (
        <Card className={cx(classes.card)} raised={true} elevation={4}>
            <CardContent className={cx(classes.content)}>
                <Box>
                    <img className={cx(classes.thumbnail)} alt='Hike pic' src={thumbnailSource} aria-label='Hike photo' />
                </Box>

                <Box className={cx(classes.details)}>
                    <Typography variant='body2'>{hike.trail}</Typography>
                    <Typography variant='body2'>{formatDateOfHike()}</Typography>

                    {
                        hikers &&
                        <Box className={cx(classes.hikers)}>
                            {
                                hikers.map((hiker: string, index: number) => {
                                    return (
                                        <Chip key={index} label={hiker.trim()} variant='outlined' color='primary' />
                                    );
                                })
                            }
                        </Box>
                    }

                    <Box className={cx(classes.description)}>{hike.description}</Box>
                </Box>
            </CardContent>
        </Card>
    )
};

export default SearchResult;
