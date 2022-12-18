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

