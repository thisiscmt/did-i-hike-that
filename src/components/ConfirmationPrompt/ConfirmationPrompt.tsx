import React, { FC } from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import {makeStyles} from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    dialogActions: {
        padding: '4px 16px 16px 16px'
    }
}));

interface ConfirmationPromptProps {
    open: boolean;
    title: string;
    content: string;
    onClose: (confim: boolean) => void
}

const ConfirmationPrompt: FC<ConfirmationPromptProps> = ({ open, title, content, onClose}) => {
    const { classes, cx } = useStyles();

    const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, reason: string) => {
        if (reason === 'backdropClick') {
            return;
        }

        onClose(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{title}</DialogTitle>

            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>

            <DialogActions className={cx(classes.dialogActions)}>
                <Button color='primary' variant='contained' onClick={() => onClose(true)}>Yes</Button>
                <Button color='secondary' variant='outlined' onClick={() => onClose(false)}>No</Button>
            </DialogActions>
        </Dialog>
    )
};

export default ConfirmationPrompt;
