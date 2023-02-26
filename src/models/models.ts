export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: string;
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
    caption?: string;
    action: 'add' | 'update' | 'delete';
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
}
