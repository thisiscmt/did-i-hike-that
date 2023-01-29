export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: string;
    notes?: string;
    link?: string;
    conditions?: string;
    crowds?: string;
    tags?: string[];
    fullNames?: string;
    filePath?: string;
    caption?: string;
    hikers?: string[];
    photos?: Photo[];
}

export interface Photo {
    file: File;
    fileName: string;
    caption: string;
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
}
