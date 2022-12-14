import React, { useCallback, useEffect, useRef } from 'react';
import { ImageMeta } from '../types/ImageMeta';
import { GetClassification } from '../api/types';

interface ImageLabelCardProps {
    imageMeta: ImageMeta;
    imageLabels: Awaited<ReturnType<GetClassification>> | null;
    hidden: boolean;
}

export const ImageLabelCard: React.FC<ImageLabelCardProps> = ({ imageMeta: { image, width, height }, imageLabels, hidden }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const drawCanvas = useCallback((canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, width, height);
        if (!hidden) {
            ctx.drawImage(image, 0, 0);
            ctx.fillStyle = 'rgb(0, 255, 0, 0.7)';
            imageLabels && imageLabels.forEach(([xmin, ymin, xmax, ymax, confidence, clazz, name]) => {
                const width = xmax - xmin, height = ymax - ymin;
                ctx.fillRect(xmin, ymin, width, height);
            });
        }
    }, [image, imageLabels, hidden]);
    useEffect(() => {
        if (ref.current) {
            drawCanvas(ref.current);
        }
    }, [ref, drawCanvas]);
    return (
        <canvas ref={ref} width={width} height={height} style={{ maxWidth: '100%' }} />
    );
};
