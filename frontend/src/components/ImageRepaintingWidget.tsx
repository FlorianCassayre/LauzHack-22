import { Button, CircularProgress, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Delete } from '@mui/icons-material';
import { mockImageLabels } from '../data/mock';
import { ImageCropCard } from './ImageCropCard';
import { ImageLabelCard } from './ImageLabelCard';
import { ImageMeta } from '../types/ImageMeta';
import { Crop } from 'react-image-crop';
import { useAsyncFn } from 'react-use';
import { ReplaceBy } from '../types/ReplaceBy';
import { getImageFile, postReplaceAreaImageFile } from '../api/backendApi';
import { blobToImage } from '../utils/image';

const POLLING_INTERVAL = 2000;

interface ImageRepaintingWidgetProps {
    imageMeta: ImageMeta;
    onResetFile: () => void;
}

export const ImageRepaintingWidget: React.FC<ImageRepaintingWidgetProps> = ({ imageMeta, onResetFile }) => {
    // TODO labels
    const [{ loading: loadingReplace }, replaceImage] = useAsyncFn(postReplaceAreaImageFile);
    const [{ loading: loadingReplacedImage, value: valueReplacedImage }, getReplacedImage] = useAsyncFn(getImageFile);
    const [replacedImage, setReplacedImage] = useState<HTMLImageElement | null>(null);
    useEffect(() => {
        if (valueReplacedImage) {
            blobToImage(valueReplacedImage, setReplacedImage);
        } else {
            setReplacedImage(null);
        }
    }, [valueReplacedImage, setReplacedImage]);

    const handleCropConfirm = (crop: Crop, replaceBy: ReplaceBy) => {
        replaceImage({
            file_id: imageMeta.fileId,
            rectangle: {
                min_x: crop.x,
                min_y: crop.y,
                max_x: crop.x + crop.width,
                max_y: crop.y + crop.height,
            },
            replace_by: replaceBy,
        }).then(({ file_id }) => getReplacedImage(file_id));
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} textAlign="center">
                <Button variant="outlined" startIcon={<Delete />} onClick={() => onResetFile()} disabled={loadingReplace} sx={{ mb: 2 }}>
                    Remove file
                </Button>
            </Grid>
            {!loadingReplace ? (
                <>
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
                        <ImageLabelCard imageMeta={{ ...imageMeta, ...(replacedImage ? { image: replacedImage } : {}) }} imageLabels={mockImageLabels} />
                    </Grid>
                </>
            ) : (
                <Grid item xs={12} textAlign="center">
                    <CircularProgress />
                </Grid>
            )}

        </Grid>
    );
};
