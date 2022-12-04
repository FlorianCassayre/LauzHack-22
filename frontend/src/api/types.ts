import { ReplaceBy } from '../types/ReplaceBy';

interface PostImageResponse {
    fileId: string;
}

interface PostReplaceRequestBody {
    file_id: string;
    rectangle: {
        min_x: number;
        min_y: number;
        max_x: number;
        max_y: number;
    }
    replace_by: ReplaceBy;
}

interface PostReplaceResponse {
    fileId: string;
}

interface GetStatusResponse {
    status: any; // TODO
}

// Methods

export type PostImage = (imageBlob: Blob) => Promise<PostImageResponse>;

export type PostReplace = (body: PostReplaceRequestBody) => Promise<PostReplaceResponse>;

export type GetFile = (fileId: string) => Promise<any>;

export type GetStatus = (fileId: string) => Promise<GetStatusResponse>;
