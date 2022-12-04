import React, { useCallback, useState } from 'react';
import { Box, Container, Divider, LinearProgress, Link, Stack } from '@mui/material';
import { FileSelectCard } from './FileSelectCard';
import { MainAppBar } from './MainAppBar';
import { ImageMeta } from '../types/ImageMeta';
import { CameraWidget } from './CameraWidget';
import { useAsyncFn } from 'react-use';
import { postImageFile } from '../api/backendApi';
import { imageToBlob } from '../utils/image';
import { ImageRepaintingWidget } from './ImageRepaintingWidget';
import { useSnackbar } from 'notistack';
import { GitHub } from '@mui/icons-material';

export const Homepage: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
    const [imageMetaLoading, setImageMetaLoading] = useState(false);
    const [{ loading: loadingUpload, value: valueUpload }, uploadImage] = useAsyncFn((blob: Blob) => postImageFile(blob).catch(e => {
        enqueueSnackbar('An error occurred while uploading the image', { variant: 'error' });
        throw e;
    }));
    const handleImageUrlChange = useCallback((imageUrl: string) => {
        const image = new Image();
        image.onload = function() { // <- This has to be a function (because of the `this`)
            const { width, height } = this as any;

            const canvas = document.createElement("canvas");
            canvas.width = Math.floor(image.width / 64) * 64;
            canvas.height = Math.floor(image.height / 64) * 64;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(image, 0, 0);
            const croppedUrl = canvas.toDataURL('image/wepb');
            const croppedImage = new Image();
            croppedImage.onload = function() {
                // Create blob
                imageToBlob(croppedImage, blob => {
                    uploadImage(blob).then(({ file_id }) => {
                        setImageMeta({ fileId: file_id, image: croppedImage, url: imageUrl, width, height });
                        setImageMetaLoading(false);
                    });
                });
            }
            croppedImage.src = croppedUrl;
        };
        image.src = imageUrl;
    }, [uploadImage, setImageMeta]);
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
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <MainAppBar />
            {(imageMetaLoading || loadingUpload) && (
                <LinearProgress />
            )}
            <Container sx={{ my: 3 }}>
                {(!imageMeta || imageMetaLoading || !valueUpload || loadingUpload) ? (
                    <>
                        <FileSelectCard onFileSelected={handleFileSelected} disabled={imageMetaLoading || loadingUpload} />
                        <Divider sx={{ my: 4, textTransform: 'uppercase' }}>
                            Or
                        </Divider>
                        <CameraWidget onPhotoTaken={(photoUrl) => handleImageUrlChange(photoUrl)} disabled={imageMetaLoading || loadingUpload} />
                    </>
                ) : (
                    <ImageRepaintingWidget imageMeta={imageMeta} onResetFile={handleResetFile} />
                )}
            </Container>
            <Box textAlign="center" sx={{ mt: 'auto', bgcolor: 'grey.200', py: 3, color: 'text.secondary' }}>
                <Stack spacing={2}>
                    <Box>
                        A project developed during <Link href="https://lauzhack.com/" target="_blank">LauzHack 2022</Link>
                    </Box>
                    <Box>
                        <Link href="https://github.com/FlorianCassayre/LauzHack-22" target="_blank" color="inherit">
                            <GitHub />
                        </Link>
                    </Box>
                </Stack>
            </Box>
        </Box>
    );
}
