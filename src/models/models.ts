export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: string;
    conditions?: string;
    crowds?: string;
    hikers?: string[];
    link?: string;
    description?: string;
    tags?: string[];
    photos?: Photo[];
    fullNames?: string;
    filePath?: string;
    caption?: string;
}

export interface Hiker {
    fullName: string;
}

export interface Photo {
    file: File;
    fileName: string;
    filePath: string;
    caption: string;
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
}
