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

export const postReplaceAreaImageFile: PostReplace = (fileId, body) => fetch(
    `${BACKEND_ENDPOINT}/replace?filedId=${fileId}`,
    {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    },
).then(r => r.json());

export const mockedPostReplaceAreaImageFile: PostReplace = (fileId) => {
    throw new Error('Not implemented');
};

export const getImageFile: GetFile = (fileId) => fetch(
    `${BACKEND_ENDPOINT}/file?filedId=${fileId}`,
    { method: 'GET' },
).then(r => r.body);

export const mockedGetImageFile: GetFile = (fileId) => {
    throw new Error('Not implemented');
};

export const getImageFileStatus: GetStatus = (fileId) => fetch(
    `${BACKEND_ENDPOINT}/status?filedId=${fileId}`,
    { method: 'GET' },
).then(r => r.json());

export const mockedGetImageFileStatus: GetStatus = (fileId) => {
    throw new Error('Not implemented');
};
