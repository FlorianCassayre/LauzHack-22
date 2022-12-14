import { Alert, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Close, Download } from '@mui/icons-material';
import { ImageCropCard } from './ImageCropCard';
import { ImageLabelCard } from './ImageLabelCard';
import { ImageMeta } from '../types/ImageMeta';
import { Crop } from 'react-image-crop';
import { useAsync, useAsyncFn } from 'react-use';
import { ReplaceBy } from '../types/ReplaceBy';
import { getClassification, getImageFile, postReplaceAreaImageFile } from '../api/backendApi';
import { blobToImage } from '../utils/image';
import { useSnackbar } from 'notistack';
import { GetFile, PostReplace } from '../api/types';
import { EstimationCard } from './EstimationCard';

interface ImageRepaintingWidgetProps {
    imageMeta: ImageMeta;
    onResetFile: () => void;
}

export const ImageRepaintingWidget: React.FC<ImageRepaintingWidgetProps> = ({ imageMeta, onResetFile }) => {
    // TODO labels
    const { enqueueSnackbar } = useSnackbar();
    const [hideLabels, setHideLabels] = useState(true);
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
    const { value: valueClassification, loading: loadingClassification } = useAsync(() => getClassification(imageMeta.fileId).catch(e => {
        enqueueSnackbar('An error occurred while detecting the objects on the image', { variant: 'error' });
        throw e;
    }));

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
    const handleSave = () => {
        if(valueReplacedImage) {
            const a = document.createElement("a");
            document.body.appendChild(a);
            (a as any).style = "display: none";
            const url = window.URL.createObjectURL(valueReplacedImage);
            a.href = url;
            a.download = 'sustAInability.webp';
            a.click();
            window.URL.revokeObjectURL(url);
        }
    };

    return (
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} textAlign="center">
                <Button variant="outlined" color="inherit" startIcon={<Close />} onClick={() => onResetFile()} disabled={loadingReplace} sx={{ mb: 2 }}>
                    Close image
                </Button>
            </Grid>
            {!loadingReplace ? (
                <>
                    {!replacedImage && (
                        <Grid item xs={12}>
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
                        <ImageCropCard imageMeta={imageMeta} imageLabels={valueClassification ?? null} onCropConfirm={handleCropConfirm} hideLabels={hideLabels} setHideLabels={setHideLabels} />
                    </Grid>
                    {replacedImage && (
                        <Grid item xs={6} textAlign="center">
                            <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                                After
                            </Typography>
                            <ImageLabelCard imageMeta={{ ...imageMeta, ...(replacedImage ? { image: replacedImage } : {}) }} imageLabels={null /*valueClassification ?? null*/} hidden={false} />
                            <Stack direction="row" justifyContent="center">
                                <Button variant="outlined" size="large" startIcon={<Download />} onClick={handleSave} sx={{ mt: 2 }}>
                                    Save result
                                </Button>
                            </Stack>
                        </Grid>
                    )}
                    <Grid item xs={12} md={6} sx={{ mt: 2 }}>
                        <EstimationCard classification={valueClassification ?? null} />
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
