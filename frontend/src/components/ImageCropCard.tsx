import React, { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from '@mui/material';
import { ImageMeta } from '../types/ImageMeta';

interface ImageCardProps {
    imageMeta: ImageMeta;
    onCropConfirm: (crop: Crop) => void;
}

export const ImageCropCard: React.FC<ImageCardProps> = ({ imageMeta, onCropConfirm }) => {
    const ref = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const handleConfirmSelection = () => {
        if (crop && ref.current) {
            const image = ref.current;
            const c = imageMeta.width / image.width;
            const modifiedCrop: Crop = {
                x: crop.x * c,
                y: crop.y * c,
                width: crop.width * c,
                height: crop.height * c,
                unit: crop.unit,
            };
            onCropConfirm(modifiedCrop);
        }
        setCrop(undefined);
    };
    return (
        <>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img src={imageMeta.url} alt="Preview" ref={ref} />
            </ReactCrop>
            {JSON.stringify(crop)}
            {!!crop && (
                <Button variant="outlined" onClick={handleConfirmSelection}>
                    Confirm selection
                </Button>
            )}
        </>
    );
};
