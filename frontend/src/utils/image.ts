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

export const blobToImage = (blob: Blob, callback: (image: HTMLImageElement) => void) => {
    const image = new Image();
    const objectURL = URL.createObjectURL(blob);
    image.onload = function () {
        callback(image);
    };
    image.src = objectURL;
};
