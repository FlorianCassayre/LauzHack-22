import React from 'react';
import {
    AppBar,
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Toolbar,
    Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors'
import { InfoRounded } from '@mui/icons-material';
import { ProjectDescription } from './ProjectDescription';

export const MainAppBar: React.FC = () => {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    About this project
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <ProjectDescription />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={handleClose} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <AppBar position="static" sx={{ bgcolor: grey[800] }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        sust<span style={{ textDecoration: 'underline' }}>AI</span>nability
                    </Typography>
                    <Button color="inherit" startIcon={<InfoRounded />} onClick={() => setOpen(true)}>
                        About this project
                    </Button>
                </Toolbar>
            </AppBar>
        </>

    );
}