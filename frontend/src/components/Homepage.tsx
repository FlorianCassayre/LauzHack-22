import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Container, Divider, Grid, Stack, Typography } from '@mui/material';
import { FileSelectCard } from './FileSelectCard';
import { MainAppBar } from './MainAppBar';
import { Delete } from '@mui/icons-material';
import { ImageCropCard } from './ImageCropCard';
import { ImageMeta } from '../types/ImageMeta';
import { ImageLabelCard } from './ImageLabelCard';
import { mockImageLabels } from '../data/mock';
import { CameraWidget } from './CameraWidget';

export const Homepage: React.FC = () => {
    const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
    const [imageMetaLoading, setImageMetaLoading] = useState(false);
    const handleImageUrlChange = useCallback((imageUrl: string) => {
        const img = new Image();
        img.onload = function() {
            const { width, height } = this as any;
            setImageMeta({ image: img, url: imageUrl, width, height });
            setImageMetaLoading(false);
        }
        img.src = imageUrl;
    }, [setImageMeta]);
    const handleFileSelected = useCallback((fileSelected: File) => {
        setImageMetaLoading(true);
        if (fileSelected) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result as string;
                handleImageUrlChange(imageUrl);
            };
            reader.readAsDataURL(fileSelected);
        } else {
            setImageMeta(null);
            setImageMetaLoading(false);
        }
    }, [handleImageUrlChange]);

    const handleResetFile = () => {
        setImageMeta(null);
        setImageMetaLoading(false);
    }

    return (
        <>
            <MainAppBar />
            <Container sx={{ my: 3 }}>
                {!imageMeta && (
                    <>
                        <FileSelectCard onFileSelected={handleFileSelected} disabled={imageMetaLoading} />
                        <Divider sx={{ my: 2, textTransform: 'uppercase' }}>
                            Or
                        </Divider>
                        <CameraWidget onPhotoTaken={(photoUrl) => handleImageUrlChange(photoUrl)} disabled={imageMetaLoading} />
                    </>
                )}
                {!!imageMeta && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} textAlign="center">
                            <Button variant="outlined" startIcon={<Delete />} onClick={handleResetFile} sx={{ mb: 2 }}>
                                Remove file
                            </Button>
                        </Grid>
                        <Grid item xs={6} textAlign="center">
                            <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                                Before
                            </Typography>
                            <ImageCropCard imageUrl={imageMeta.url} />
                        </Grid>
                        <Grid item xs={6} textAlign="center">
                            <Typography sx={{ mb: 1, fontWeight: 'medium' }}>
                                After
                            </Typography>
                            <ImageLabelCard imageMeta={imageMeta} imageLabels={mockImageLabels} />
                        </Grid>
                    </Grid>
                )}
            </Container>
        </>
    );
}
