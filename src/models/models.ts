export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: string;
    endDateOfHike?: string;
    conditions?: string;
    crowds?: string;
    hikers?: Hiker[];
    link?: string;
    linkLabel?: string;
    description?: string;
    tags?: string;
    photos?: Photo[];
    fullNames?: string;
    filePath?: string;
    caption?: string;
    updatedAt?: Date;
}

export interface Hiker {
    fullName: string;
}

export interface Photo {
    id?: string;
    file: File;
    fileName: string;
    filePath: string;
    ordinal: number;
    caption?: string;
    editCaption?: boolean;
    thumbnailSrc?: string;
    action: 'add' | 'update' | 'delete';
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
}

export interface User {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    role: string;
    lastLogin?: number;
//    createdAt?: Date;
//    updatedAt?: Date;
}

export interface Session {
    sid: string;
    expires: string;
    data: string;
    createdAt: string;
}

export interface LoginResponse {
    fullName: string;
    role: string;
}
