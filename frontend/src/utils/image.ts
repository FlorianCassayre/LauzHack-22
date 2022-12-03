export const imageToBlob = (image: HTMLImageElement, callback: (blob: Blob) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(image, 0, 0);
    canvas.toBlob(blob => {
        if (blob) {
            callback(blob);
        }
    });
};
