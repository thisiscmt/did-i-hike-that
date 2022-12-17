import React from 'react';
import { Link } from 'react-router-dom';
import {Button, Typography} from '@mui/material';
import {makeStyles} from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        backgroundColor: '#F3F3F3',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '60px',
        paddingLeft: '40px',
        paddingRight: '40px'
    },

    headerText: {
        marginRight: '30px'
    },

    addButton: {
        marginLeft: 'auto'
    }
}));

const Header = () => {
    const { classes, cx } = useStyles();

    return (
        <header className={cx(classes.mainContainer)}>
            <Typography variant='h5' className={cx(classes.headerText)}>Did I Hike That?</Typography>

            <Button variant='text' component={Link} to='/'>Home</Button>
            <Button variant='text' component={Link} to='preferences/'>Preferences</Button>
            <Button component={Link} variant='contained' to='/hike' color="primary" className={cx(classes.addButton)}>Add Hike</Button>
        </header>
    )
}

export default Header;
