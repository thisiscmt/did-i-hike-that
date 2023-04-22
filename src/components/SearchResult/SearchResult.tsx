import React, { FC } from 'react';
import {Box, Typography, Chip, Card, CardContent} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import {Hike} from '../../models/models';
import * as SharedService from '../../services/sharedService';
import {PHOTO_THUMBNAIL_SIZE} from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    cardContent: {
        display: 'flex',

        [theme.breakpoints.down(500)]: {
            flexDirection: 'column'
        },
    },

    thumbnail: {
        display: 'flex',
        minWidth: `${PHOTO_THUMBNAIL_SIZE}px`,
        width: `${PHOTO_THUMBNAIL_SIZE}px`
    },

    details: {
        marginLeft: '40px',

        '& .MuiChip-root': {
            marginRight: '8px',
            marginTop: '6px'
        },

        '& .MuiChip-root:last-child': {
            marginRight: 0
        },

        [theme.breakpoints.down(700)]: {
            marginLeft: '20px'
        },

        [theme.breakpoints.down(500)]: {
            marginLeft: 0,
            marginTop: '8px'
        },
    },

    hikers: {
        marginBottom: '5px',
        marginTop: '5px'
    },

    description: {
        fontSize: '14px',
        marginTop: '12px',
        display: '-webkit-box',
        '-webkitLineClamp': '4',
        '-webkitBoxOrient': 'vertical',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap'
    }
}));

interface SearchResultProps {
    hike: Hike;
}

const SearchResult: FC<SearchResultProps> = ({ hike }) => {
    const { classes, cx } = useStyles();
    const thumbnailSrc = SharedService.getThumbnailSrc(hike.filePath || '');
    const hikers = hike.fullNames ? hike.fullNames.split(',') : [];

    return (
        <Card>
            <CardContent className={cx(classes.cardContent)}>
                <Box className={cx(classes.thumbnail)}>
                    <img alt='Hike pic' src={thumbnailSrc} aria-label='Hike pic' />
                </Box>

                <Box className={cx(classes.details)}>
                    <Typography variant='body2'>{hike.trail}</Typography>
                    <Typography variant='body2'>{SharedService.formatDateOfHike(hike.dateOfHike)}</Typography>

                    {
                        hikers && hikers.length > 0 &&
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
