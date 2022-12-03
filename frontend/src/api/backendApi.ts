import { PostImageResponse } from './types';

const BACKEND_ENDPOINT = 'http://localhost:8080';

export const postImageFile = (imageBlob: Blob): Promise<PostImageResponse> => {
    const formData = new FormData()
    formData.append('file', imageBlob, 'image')
    return fetch(
        `${BACKEND_ENDPOINT}/file`,
        { method: 'POST', body: formData },
    ).then(r => r.json());
};

export const mockedPostImageFile = (imageBlob: Blob): Promise<PostImageResponse> => {
    console.log(imageBlob);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ fileId: `${Math.random()}` });
        }, 1000)
    })
};
