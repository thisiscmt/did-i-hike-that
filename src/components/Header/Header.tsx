import React from 'react';
import { Link } from 'react-router-dom';
import {Box} from '@mui/material';

const Header = () => {
    return (
        <header>
            <Box>
                <Link to={'/'}>
                    <span>Did I Hike That?</span>
                </Link>
            </Box>

            <Box>
                {/*<Link to={'/recipe'} className={'nav-link'} title={'Add a new recipe'}>*/}
                {/*    <AddBoxOutlinedIcon fontSize={'large'} />*/}
                {/*</Link>*/}
            </Box>
        </header>
    )
}

export default Header;
