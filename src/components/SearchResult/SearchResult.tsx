import React, { FC } from 'react';
import { Box, Typography, Chip} from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import {Hike} from '../../models/models';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex'
    },

    thumbnail: {
        width: '150px'
    },

    content: {
        marginLeft: '50px',

        '& .MuiChip-root': {
            marginRight: '8px'
        },

        '& .MuiChip-root:last-child': {
            marginRight: 0
        }
    },

    hikers: {
        marginTop: '10px'
    },

    description: {
        fontSize: '14px',
        marginTop: '10px',
        display: '-webkit-box',
        webkitLineClamp: '4',
        webkitBoxOrient: 'vertical',
        overflow: 'hidden'
    }
}));

interface SearchResultProps {
    hike: Hike;
}

const SearchResult: FC<SearchResultProps> = ({ hike }) => {
    const { classes, cx } = useStyles();
    const thumbnailSource = hike.filePath ? `${process.env.REACT_APP_API_URL}/images/` + hike.filePath : 'images/no_hike_images_2.png';
    const hikers = hike.fullNames?.split(',');

    const formatDateOfHike = () => {
        const dateParts = hike.dateOfHike.split('-');
        return `${Number(dateParts[1])}/${Number(dateParts[2])}/${dateParts[0]}`;
    };

    return (
        <Box className={cx(classes.mainContainer)}>
            <Box>
                <img className={cx(classes.thumbnail)} alt='Hike pic' src={thumbnailSource} aria-label='Hike photo' />
            </Box>

            <Box className={cx(classes.content)}>
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
        </Box>
    )
};

export default SearchResult;
