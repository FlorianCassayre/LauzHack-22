import { Button, Grid, Typography } from '@mui/material';
import React from 'react';
import { Delete } from '@mui/icons-material';
import { mockImageLabels } from '../data/mock';
import { ImageCropCard } from './ImageCropCard';
import { ImageLabelCard } from './ImageLabelCard';
import { ImageMeta } from '../types/ImageMeta';
import { Crop } from 'react-image-crop';
import { useAsyncFn } from 'react-use';
import { ReplaceBy } from '../types/ReplaceBy';
import { postReplaceAreaImageFile } from '../api/backendApi';

interface ImageRepaintingWidgetProps {
    imageMeta: ImageMeta;
    onResetFile: () => void;
}

export const ImageRepaintingWidget: React.FC<ImageRepaintingWidgetProps> = ({ imageMeta, onResetFile }) => {
    // TODO labels
    const [{ loading: loadingReplace, value: valueReplace }, replaceImage] = useAsyncFn(postReplaceAreaImageFile);
    const handleCropConfirm = (crop: Crop) => {
        replaceImage(imageMeta.fileId, {
            rectangle: {
                x: crop.x,
                y: crop.y,
                width: crop.width,
                height: crop.height,
            },
            by: ReplaceBy.Bush,
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
                <Button variant="outlined" startIcon={<Delete />} onClick={() => onResetFile()} sx={{ mb: 2 }}>
                    Remove file
                </Button>
            </Grid>
            <Grid item xs={6} textAlign="center">
                <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                    Before
                </Typography>
                <ImageCropCard imageMeta={imageMeta} onCropConfirm={handleCropConfirm} />
            </Grid>
            <Grid item xs={6} textAlign="center">
                <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                    After
                </Typography>
                <ImageLabelCard imageMeta={imageMeta} imageLabels={mockImageLabels} />
            </Grid>
        </Grid>
    );
};
