import React, { useRef, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { ImageMeta } from '../types/ImageMeta';
import { ReplaceByDropdown } from './ReplaceByDropdown';
import { ReplaceBy } from '../types/ReplaceBy';

interface ImageCardProps {
    imageMeta: ImageMeta;
    onCropConfirm: (crop: Crop, replaceBy: ReplaceBy) => void;
}

export const ImageCropCard: React.FC<ImageCardProps> = ({ imageMeta, onCropConfirm }) => {
    const ref = useRef<HTMLImageElement | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const handleConfirmSelection = (replaceBy: ReplaceBy) => {
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
            onCropConfirm(modifiedCrop, replaceBy);
        }
        setCrop(undefined);
    };
    return (
        <>
            <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                <img src={imageMeta.url} alt="Preview" ref={ref} />
            </ReactCrop>
            <ReplaceByDropdown onClickReplaceBy={handleConfirmSelection} disabled={!crop} />
        </>
    );
};
