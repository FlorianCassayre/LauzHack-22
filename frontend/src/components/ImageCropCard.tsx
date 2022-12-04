import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { ImageMeta } from '../types/ImageMeta';
import { ReplaceByDropdown } from './ReplaceByDropdown';
import { ReplaceBy } from '../types/ReplaceBy';
import { Button, Stack } from '@mui/material';
import { GetClassification } from '../api/types';
import { ArrowDropDown, Visibility, VisibilityOff } from '@mui/icons-material';
import { ReplaceFeatureDropdown } from './ReplaceFeatureDropdown';

interface ImageCardProps {
    imageMeta: ImageMeta;
    imageLabels: Awaited<ReturnType<GetClassification>> | null;
    onCropConfirm: (crop: Crop, replaceBy: ReplaceBy) => void;
    hideLabels: boolean;
    setHideLabels: (hideLabels: boolean) => void;
}

export const ImageCropCard: React.FC<ImageCardProps> = ({ imageMeta: { image, width, height }, imageLabels, onCropConfirm, hideLabels, setHideLabels }) => {
    const [crop, setCrop] = useState<Crop>();
    const handleConfirmSelection = (replaceBy: ReplaceBy) => {
        if (crop && ref.current) {
            const image = ref.current;
            const c = width / image.width;
            const modifiedCrop: Crop = {
                x: crop.x * c,
                y: crop.y * c,
                width: crop.width * c,
                height: crop.height * c,
                unit: crop.unit,
            };
            onCropConfirm(modifiedCrop, replaceBy);
        }
        setCrop(undefined);
    };
    const ref = useRef<HTMLCanvasElement>(null);
    const drawCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
            ctx.drawImage(image, 0, 0);
        if (!hideLabels) {
            ctx.fillStyle = 'none';
            ctx.strokeStyle = 'rgb(0, 255, 0, 0.75)';
            ctx.lineWidth = 5;
            imageLabels && imageLabels.forEach(([xmin, ymin, xmax, ymax, confidence, clazz, name]) => {
                const width = xmax - xmin, height = ymax - ymin;
                ctx.strokeRect(xmin, ymin, width, height);
            });
        }
    }, [image, imageLabels, hideLabels]);
    useEffect(() => {
        if (ref.current) {
            drawCanvas(ref.current);
        }
    }, [ref, drawCanvas]);
    return (
        <Stack direction="column" alignItems="center" spacing={2}>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <canvas ref={ref} width={width} height={height} style={{ maxWidth: '100%' }} />
            </ReactCrop>
            <Stack direction="row" spacing={2}>
                <Button variant="outlined" startIcon={!hideLabels ? <Visibility /> : <VisibilityOff />} onClick={() => setHideLabels(!hideLabels)}>Features</Button>
                {/*<ReplaceFeatureDropdown onClickReplaceBy={() => {}} disabled={!crop} />*/}
                <ReplaceByDropdown onClickReplaceBy={handleConfirmSelection} disabled={!crop} />
            </Stack>
        </Stack>
    );
};
