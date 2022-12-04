import { GetFile, GetStatus, PostImage, PostReplace } from './types';

const BACKEND_ENDPOINT = 'http://localhost:8080';

export const postImageFile: PostImage = (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'image');
    return fetch(
        `${BACKEND_ENDPOINT}/file`,
        { method: 'POST', body: formData },
    ).then(r => r.json());
};

export const mockedPostImageFile: PostImage = (imageBlob) => {
    console.log(imageBlob);
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ fileId: `${Math.random()}` });
        }, 1000)
    })
};

export const postReplaceAreaImageFile: PostReplace = (fileId: string) => {
    throw new Error('Not implemented');
};

export const mockedPostReplaceAreaImageFile: PostReplace = (fileId: string) => {
    throw new Error('Not implemented');
};

export const getImageFile: GetFile = (fileId: string) => {
    throw new Error('Not implemented');
};

export const mockedGetImageFile: GetFile = (fileId: string) => {
    throw new Error('Not implemented');
};

export const getImageFileStatus: GetStatus = (fileId: string) => {
    throw new Error('Not implemented');
};

export const mockedGetImageFileStatus: GetStatus = (fileId: string) => {
    throw new Error('Not implemented');
};
