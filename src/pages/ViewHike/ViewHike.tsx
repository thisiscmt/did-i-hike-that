import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Card, CardContent, Chip, Typography} from '@mui/material';
import {makeStyles} from 'tss-react/mui';

import {Hike, Hiker} from '../../models/models';
import * as DataService from '../../services/dataService';
import * as SharedService from '../../services/sharedService';

const useStyles = makeStyles()((theme) => ({
    card: {
        marginBottom: '24px'
    },

    field: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '8px',

        ':last-child': {
            marginBottom: 0
        }
    },

    fieldLabel: {
        width: '100px'
    },

    trail: {
        marginBottom: '18px'
    },

    chipContainer: {
        marginBottom: '16px',
        marginTop: '16px'
    },

    chip: {
        marginRight: '8px',

        ':last-child': {
            marginRight: 0
        }
    }
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
            <Typography variant='h4' className={cx(classes.trail)}>{hike.trail}</Typography>

            <Card className={cx(classes.card)}>
                <CardContent>
                    <Box>
                        <Box className={cx(classes.field)}>
                            <Typography variant='body2' className={cx(classes.fieldLabel)}>Date of hike</Typography>
                            <Typography variant='body2'>{SharedService.formatDateOfHike(hike.dateOfHike)}</Typography>
                        </Box>

                        {
                            hike.conditions &&
                            <Box className={cx(classes.field)}>
                                <Typography variant='body2' className={cx(classes.fieldLabel)}>Conditions</Typography>
                                <Typography variant='body2'>{hike.conditions}</Typography>
                            </Box>
                        }

                        {
                            hike.crowds &&
                            <Box className={cx(classes.field)}>
                                <Typography variant='body2' className={cx(classes.fieldLabel)}>Crowds</Typography>
                                <Typography variant='body2'>{hike.crowds}</Typography>
                            </Box>
                        }
                    </Box>
                </CardContent>
            </Card>

            {
                hike.description &&
                <Card className={cx(classes.card)}>
                    <CardContent>
                        <Typography variant='body2'>{hike.description}</Typography>
                    </CardContent>

                </Card>
            }

            {
                hike.hikers && hike.hikers.length > 0 &&
                <Box className={`${cx(classes.field)} ${cx(classes.chipContainer)}`}>
                    <Typography variant='body2' className={cx(classes.fieldLabel)}>Hikers</Typography>

                    {
                        hike.hikers.map((hiker: Hiker) => (
                            <Chip key={hiker.fullName} label={hiker.fullName} className={cx(classes.chip)}></Chip>
                        ))
                    }
                </Box>
            }

            {
                hike.tags &&
                <Box className={`${cx(classes.field)} ${cx(classes.chipContainer)}`}>
                    <Typography variant='body2' className={cx(classes.fieldLabel)}>Tags</Typography>

                    {
                        hike.tags.split(',').map((tag: string) => (
                            <Chip key={tag} label={tag} className={cx(classes.chip)}></Chip>
                        ))
                    }
                </Box>
            }




        </Box>
    )
};

export default ViewHike;
