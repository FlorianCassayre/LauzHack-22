import React from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { Menu } from '@mui/icons-material';
import { grey } from '@mui/material/colors'

export const MainAppBar: React.FC = () => {

    return (
        <AppBar position="static" sx={{ bgcolor: grey[800] }}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    LauzHack-22
                </Typography>
            </Toolbar>
        </AppBar>
    );
}