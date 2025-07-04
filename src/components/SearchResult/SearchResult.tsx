import React, { FC } from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { Hike } from '../../models/models';
import * as SharedService from '../../services/sharedService';
import * as Constants from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    cardContent: {
        display: 'flex',

        [theme.breakpoints.down(500)]: {
            flexDirection: 'column'
        },
    },

    thumbnail: {
        alignItems: 'start',
        display: 'flex',
        minWidth: `${Constants.PHOTO_THUMBNAIL_SIZE}px`,
        width: `${Constants.PHOTO_THUMBNAIL_SIZE}px`
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

        [theme.breakpoints.down(Constants.HOME_PAGE_SECOND_BREAKPOINT)]: {
            marginLeft: '20px',
        },

        [theme.breakpoints.down(500)]: {
            marginLeft: 0,
            marginTop: '8px',
        },
    },

    hikers: {
        marginBottom: '5px',
        marginTop: '5px'
    },

    chip: {
        height: 'auto',

        '& .MuiChip-label': {
            paddingBottom: '9px',
            paddingTop: '9px',
            display: 'block',
            whiteSpace: 'normal'
        }
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

    const getHikeDateValue = () => {
        let dateValue = SharedService.formatDateValue(hike.dateOfHike);

        if (hike.endDateOfHike) {
            dateValue += ` to ${SharedService.formatDateValue(hike.endDateOfHike)}`;
        }

        return dateValue;
    };

    return (
        <Card>
            <CardContent className={cx(classes.cardContent)}>
                <Box className={cx(classes.thumbnail)}>
                    <img src={thumbnailSrc} alt='Hike pic' aria-label='Hike pic' />
                </Box>

                <Box className={cx(classes.details)}>
                    <Typography variant='body2'>{hike.trail}</Typography>
                    <Typography variant='body2'>{getHikeDateValue()}</Typography>

                    {
                        hikers && hikers.length > 0 &&
                        <Box className={cx(classes.hikers)}>
                            {
                                hikers.sort().map((hiker: string, index: number) => {
                                    return (
                                        <Chip key={index} label={hiker.trim()} variant='outlined' color='primary' className={cx(classes.chip)} />
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
