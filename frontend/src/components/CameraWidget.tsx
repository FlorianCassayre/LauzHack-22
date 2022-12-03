import React, { useState } from 'react';
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { Box, Button } from '@mui/material';

interface CameraWidgetProps {
    onPhotoTaken: (photoUrl: string) => void;
    disabled: boolean;
}

export const CameraWidget: React.FC<CameraWidgetProps> = ({ onPhotoTaken, disabled }) => {
    const [open, setOpen] = useState(false);
    return (
        <Box textAlign="center">
            <Button variant="outlined" onClick={() => setOpen(!open)} disabled={disabled}>
                {open ? 'Close' : 'Open'} Camera
            </Button>
            {open && (
                <Box sx={{ mt: 2 }}>
                    <Camera onTakePhoto={(dataUri) => onPhotoTaken(dataUri)} />
                </Box>
            )}
        </Box>
    );
};
