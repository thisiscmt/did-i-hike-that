export interface Hike {
    id?: string;
    trail: string;
    dateOfHike: Date;
    description?: string;
    link?: string;
    conditions?: string;
    crowds?: string;
    tags?: string;
    hikers?: string[];
    photos?: File[];
}

export interface HikeSearchParams {
    page?: number;
    pageSize?: number;
    startDate?: Date;
    endDate?: Date;
    searchText?: string;
}
