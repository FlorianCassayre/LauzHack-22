import { Alert, Button, CircularProgress, Grid, Typography } from '@mui/material';
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
import { useSnackbar } from 'notistack';
import { GetFile, PostReplace } from '../api/types';

interface ImageRepaintingWidgetProps {
    imageMeta: ImageMeta;
    onResetFile: () => void;
}

export const ImageRepaintingWidget: React.FC<ImageRepaintingWidgetProps> = ({ imageMeta, onResetFile }) => {
    // TODO labels
    const { enqueueSnackbar } = useSnackbar();
    const [{ loading: loadingReplace }, replaceImage] = useAsyncFn((body: Parameters<PostReplace>[0]) =>
        postReplaceAreaImageFile(body)
        .catch(e => {
            enqueueSnackbar('An error occurred while painting the image', { variant: 'error' });
            throw e;
        })
    );
    const [{ loading: loadingReplacedImage, value: valueReplacedImage }, getReplacedImage] = useAsyncFn((fileId: Parameters<GetFile>[0]) =>
        getImageFile(fileId)
            .catch(e => {
                enqueueSnackbar('An error occurred while retrieving the painted', { variant: 'error' });
                throw e;
            })
    );
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
        })
            .then((obj) => obj && getReplacedImage(obj.file_id));
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} textAlign="center">
                <Button variant="outlined" color="inherit" startIcon={<Delete />} onClick={() => onResetFile()} disabled={loadingReplace} sx={{ mb: 2 }}>
                    Remove file
                </Button>
            </Grid>
            {!loadingReplace ? (
                <>
                    {!replacedImage && (
                        <Grid item xs={12} md={8}>
                            <Alert severity="info">
                                Select the area that you would like to repaint, and choose a replacement by clicking on the button below.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={replacedImage ? 6 : 12} textAlign="center">
                        {replacedImage && (
                            <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                                Before
                            </Typography>
                        )}
                        <ImageCropCard imageMeta={imageMeta} onCropConfirm={handleCropConfirm} />
                    </Grid>
                    {replacedImage && (
                        <Grid item xs={6} textAlign="center">
                            <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                                After
                            </Typography>
                            <ImageLabelCard imageMeta={{ ...imageMeta, ...(replacedImage ? { image: replacedImage } : {}) }} imageLabels={mockImageLabels} hidden={!replacedImage} />
                        </Grid>
                    )}
                </>
            ) : (
                <Grid item xs={12} textAlign="center">
                    <CircularProgress />
                </Grid>
            )}

        </Grid>
    );
};
