import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Chip, Typography} from '@mui/material';
import {makeStyles} from 'tss-react/mui';

import {Hike, Hiker} from '../../models/models';
import * as DataService from '../../services/dataService';

const useStyles = makeStyles()((theme) => ({


}));

const ViewHike = () => {
    const { classes, cx } = useStyles();
    const [ hike, setHike ] = useState<Hike>({ trail: '', dateOfHike: '' });
    const { hikeId } = useParams();

    useEffect(() => {
        const getHike = async () => {
            try {
                if (hikeId) {
                    const currentHike = await DataService.getHike(hikeId);

                    console.log('currentHike: %o', currentHike);

                    setHike(currentHike);
                } else {
                    // TODO: Show a message saying the given hike wasn't found
                }
            } catch(error) {
                // TODO: Log this somewhere
            }
        }

        document.title = 'View Hike - Did I Hike That?';
        getHike();
    }, [hikeId]);

    return (
        <Box>
            <Typography variant='h4'>{hike.trail}</Typography>

            <Box>
                <Box>
                    <Typography variant='body2'>Date of hike</Typography>
                    <Typography variant='body2'>{hike.dateOfHike}</Typography>
                </Box>

                {
                    hike.conditions &&
                    <Box>
                        <Typography variant='body2'>Conditions</Typography>
                        <Typography variant='body2'>{hike.conditions}</Typography>
                    </Box>
                }

                {
                    hike.crowds &&
                    <Box>
                        <Typography variant='body2'>Crowds</Typography>
                        <Typography variant='body2'>{hike.crowds}</Typography>
                    </Box>
                }
            </Box>

            {
                hike.hikers &&
                <Box>
                    <Typography variant='body2'>Crowds</Typography>

                    {
                        hike.hikers.map((hiker: Hiker) => (
                            <Chip key={hiker.fullName} label={hiker.fullName}></Chip>
                        ))
                    }
                </Box>
            }

            {
                hike.description &&
                <Typography variant='body2'>{hike.description}</Typography>
            }

            {
                hike.tags &&
                <Box>
                    <Typography variant='body2'>Tags</Typography>

                    {
                        hike.tags.split(',').map((tag: string) => (
                            <Chip key={tag} label={tag}></Chip>
                        ))
                    }
                </Box>
            }




        </Box>
    )
};

export default ViewHike;
