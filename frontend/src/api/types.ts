import { ReplaceBy } from '../types/ReplaceBy';

interface PostImageResponse {
    file_id: string;
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
    file_id: string;
}

interface GetStatusResponse {
    status: any; // TODO
}

type GetClassificationResponse = [xmin: number, ymin: number, xmax: number, ymax: number, confidence: number, clazz: number, name: string][];

// Methods

export type PostImage = (imageBlob: Blob) => Promise<PostImageResponse>;

export type PostReplace = (body: PostReplaceRequestBody) => Promise<PostReplaceResponse>;

export type GetFile = (fileId: string) => Promise<Blob>;

export type GetStatus = (fileId: string) => Promise<GetStatusResponse>;

export type GetClassification = (fileId: string) => Promise<GetClassificationResponse>;
