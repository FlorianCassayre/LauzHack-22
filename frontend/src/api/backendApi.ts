import { GetFile, GetStatus, PostImage, PostReplace } from './types';

const BACKEND_ENDPOINT = process.env.REACT_APP_BACKEND_ENDPOINT as string;

if (!BACKEND_ENDPOINT) {
    console.error('Environment variable REACT_APP_BACKEND_ENDPOINT is not set, please define it in .env');
}

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
            resolve({ file_id: `${Math.random()}` });
        }, 1000)
    })
};

export const postReplaceAreaImageFile: PostReplace = (body) => fetch(
    `${BACKEND_ENDPOINT}/replace?fileId=${body.file_id}`,
    {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    },
).then(r => r.json());

export const mockedPostReplaceAreaImageFile: PostReplace = (fileId) => {
    throw new Error('Not implemented');
};

export const getImageFile: GetFile = (fileId) => fetch(
    `${BACKEND_ENDPOINT}/file?fileId=${fileId}`,
    { method: 'GET' },
).then(r => r.blob());

export const mockedGetImageFile: GetFile = (fileId) => {
    throw new Error('Not implemented');
};

export const getImageFileStatus: GetStatus = (fileId) => fetch(
    `${BACKEND_ENDPOINT}/status?fileId=${fileId}`,
    { method: 'GET' },
).then(r => r.json());

export const mockedGetImageFileStatus: GetStatus = (fileId) => {
    throw new Error('Not implemented');
};
