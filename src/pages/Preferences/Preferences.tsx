import React, { useContext, useState } from 'react';
import { Box, FormControl, FormControlLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import useDocumentTitle from '../../hooks/useDocumentTitle';
import { MainContext } from '../../contexts/MainContext';
import * as Constants from '../../constants/constants';

const useStyles = makeStyles()((theme) => ({
    mainContainer: {
        display: 'flex',
        justifyContent: 'center'
    },

    field: {
        '& .MuiFormControlLabel-root': {
            gap: '16px',
            marginLeft: 0,
            marginRight: 0
        }
    },

    fieldLabel: {
        fontSize: '14px',
        minWidth: '100px',

        [theme.breakpoints.down(600)]: {
            minWidth: '70px'
        }
    },

    pageSizeSelector: {
        width: '100px'
    }
}));

const Preferences = () => {
    const savedPageSize = window.localStorage.getItem(Constants.STORAGE_DEFAULT_PAGE_SIZE);

    const { classes, cx } = useStyles();
    const [ pageSize, setPageSize ] = useState<string>(savedPageSize ? savedPageSize : '10');
    const { setBanner } = useContext(MainContext);

    useDocumentTitle('Preferences - Did I Hike That?');

    const handleChangePageSize = (event: SelectChangeEvent) => {
        setPageSize(event.target.value);
        window.localStorage.setItem(Constants.STORAGE_DEFAULT_PAGE_SIZE, event.target.value);

        setBanner('Preferences saved');
    };

    return (
        <Box className={cx(classes.mainContainer)}>
            <FormControl className={cx(classes.field)}>
                <FormControlLabel
                    labelPlacement='start'
                    label='Default page size'
                    classes={{ label: classes.fieldLabel }}
                    control={
                        <Select size='small' value={pageSize} className={cx(classes.pageSizeSelector)} onChange={handleChangePageSize}>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={25}>25</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    }
                />
            </FormControl>
        </Box>
    )
};

export default Preferences;
