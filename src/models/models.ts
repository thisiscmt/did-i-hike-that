export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: string;
    description?: string;
    link?: string;
    conditions?: string;
    crowds?: string;
    tags?: string;
    fullNames?: string;
    filePath?: string;
    caption?: string;
    hikers?: string[];
    photos?: File[];
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
    searchText?: string;
}
