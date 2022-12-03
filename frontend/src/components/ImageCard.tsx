import React, { useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from '@mui/material';

interface ImageCardProps {
    imageUrl: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({ imageUrl }) => {
    const [crop, setCrop] = useState<Crop>();
    const handleConfirmSelection = () => {
        console.log(crop);
        setCrop(undefined);
    };
    return (
        <>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img src={imageUrl} alt="Preview" />
            </ReactCrop>
            {!!crop && (
                <Button variant="outlined" onClick={handleConfirmSelection}>
                    Confirm selection
                </Button>
            )}
        </>
    );
};
