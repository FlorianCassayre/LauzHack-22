import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { grey } from '@mui/material/colors'

export const MainAppBar: React.FC = () => {

    return (
        <AppBar position="static" sx={{ bgcolor: grey[800] }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    sust<span style={{ textDecoration: 'underline' }}>AI</span>nability
                </Typography>
            </Toolbar>
        </AppBar>
    );
}