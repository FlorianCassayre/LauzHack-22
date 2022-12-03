import React, { useCallback, useEffect, useRef } from 'react';
import { ImageMeta } from '../types/ImageMeta';
import { ImageLabels } from '../types/ImageLabels';

interface ImageLabelCardProps {
    imageMeta: ImageMeta;
    imageLabels: ImageLabels;
}

export const ImageLabelCard: React.FC<ImageLabelCardProps> = ({ imageMeta: { image, width, height }, imageLabels }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const drawCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(image, 0, 0);
        ctx.fillStyle = 'rgb(0, 255, 0, 0.7)';
        imageLabels.data.forEach(([xmin, ymin, xmax, ymax, confidence, clazz, name]) => {
            const width = xmax - xmin, height = ymax - ymin;
            ctx.fillRect(xmin, ymin, width, height);
        });
    }, [image, imageLabels]);
    useEffect(() => {
        if (ref.current) {
            drawCanvas(ref.current);
        }
    }, [ref, drawCanvas]);
    return (
        <canvas ref={ref} width={width} height={height} style={{ maxWidth: '100%' }} />
    );
};
