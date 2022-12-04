import React, { useCallback, useState } from 'react';
import { Box, Container, Divider, LinearProgress } from '@mui/material';
import { FileSelectCard } from './FileSelectCard';
import { MainAppBar } from './MainAppBar';
import { ImageMeta } from '../types/ImageMeta';
import { CameraWidget } from './CameraWidget';
import { useAsyncFn } from 'react-use';
import { postImageFile } from '../api/backendApi';
import { imageToBlob } from '../utils/image';
import { ImageRepaintingWidget } from './ImageRepaintingWidget';
import { useSnackbar } from 'notistack';

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
            // Create blob
            imageToBlob(image, blob => {
                uploadImage(blob).then(({ file_id }) => {
                    setImageMeta({ fileId: file_id, image: image, url: imageUrl, width, height });
                    setImageMetaLoading(false);
                });
            });
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
        <>
            <MainAppBar />
            {(imageMetaLoading || loadingUpload) && (
                <LinearProgress />
            )}
            <Container sx={{ my: 3 }}>
                {(!imageMeta || imageMetaLoading || !valueUpload || loadingUpload) ? (
                    <>
                        <FileSelectCard onFileSelected={handleFileSelected} disabled={imageMetaLoading || loadingUpload} />
                        <Divider sx={{ my: 2, textTransform: 'uppercase' }}>
                            Or
                        </Divider>
                        <CameraWidget onPhotoTaken={(photoUrl) => handleImageUrlChange(photoUrl)} disabled={imageMetaLoading || loadingUpload} />
                    </>
                ) : (
                    <ImageRepaintingWidget imageMeta={imageMeta} onResetFile={handleResetFile} />
                )}
            </Container>
        </>
    );
}
