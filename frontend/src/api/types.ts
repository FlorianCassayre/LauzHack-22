import { ReplaceBy } from '../types/ReplaceBy';

interface PostImageResponse {
    fileId: string;
}

interface PostReplaceRequestBody {
    rectangle: {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    by: ReplaceBy;
}

interface PostReplaceResponse {
    fileId: string;
}

interface GetStatusResponse {
    status: any; // TODO
}

// Methods

export type PostImage = (imageBlob: Blob) => Promise<PostImageResponse>;

export type PostReplace = (fileId: string, body: PostReplaceRequestBody) => Promise<PostReplaceResponse>;

export type GetFile = (fileId: string) => Promise<any>;

export type GetStatus = (fileId: string) => Promise<GetStatusResponse>;
