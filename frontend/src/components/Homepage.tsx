import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Stack, Typography } from '@mui/material';
import { FileSelectCard } from './FileSelectCard';
import { MainAppBar } from './MainAppBar';
import { Delete } from '@mui/icons-material';
import { ImageCropCard } from './ImageCropCard';
import { ImageMeta } from '../types/ImageMeta';
import { ImageLabelCard } from './ImageLabelCard';
import { mockImageLabels } from '../data/mock';

export const Homepage: React.FC = () => {
    const [fileSelected, setFileSelected] = useState<File | null>(null);
    const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
    useEffect(() => {
        if (fileSelected) {
            const reader = new FileReader();
            reader.onload = () => {
                const imageUrl = reader.result as string;
                const img = new Image();
                img.onload = function() {
                    const { width, height } = this as any;
                    setImageMeta({ image: img, url: imageUrl, width, height });
                }
                img.src = imageUrl;
            };
            reader.readAsDataURL(fileSelected);
        } else {
            setImageMeta(null);
        }
    }, [fileSelected]);

    const handleFileSelected = (file: File) => {
        setFileSelected(file);
    };
    const handleResetFile = () => {
        setFileSelected(null);
        setImageMeta(null);
    }

    return (
        <>
            <MainAppBar />
            <Container sx={{ my: 3 }}>
                {!fileSelected && (
                    <FileSelectCard onFileSelected={handleFileSelected} />
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
