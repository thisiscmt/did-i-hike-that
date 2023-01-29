import Axios, {AxiosProgressEvent, AxiosRequestConfig} from 'axios';

import {Hike, HikeSearchParams} from '../models/models';

export const getHikes = async (searchParams?: HikeSearchParams): Promise<{ rows: Hike[]; count: number }> => {
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    if (searchParams) {
        config.params = { ...searchParams };
    }

    const response = await Axios.get(process.env.REACT_APP_API_URL + '/hike', config)
    return response.data;
};

export const getHike = async (hikeId: string) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        },
        params: {
            id: hikeId
        }
    };


    const response = await Axios.get(process.env.REACT_APP_API_URL + '/hike:id', config)
    return response.data;
};

export const createHike = (hike: Hike, onUploadProgress?: (axiosProgressEvent: AxiosProgressEvent) => void) => {
    const formData = new FormData();
    formData.append('trail', hike.trail);
    formData.append('dateOfHike', hike.dateOfHike);

    if (hike.description) {
        formData.append('description', hike.description);
    }

    if (hike.link) {
        formData.append('link', hike.link);
    }

    if (hike.conditions) {
        formData.append('conditions', hike.conditions);
    }

    if (hike.crowds) {
        formData.append('description', hike.crowds);
    }

    if (hike.tags) {
        formData.append('description', hike.tags);
    }

    if (hike.hikers) {
        formData.append('description', hike.hikers.join(','));
    }

    if (hike.photos) {
        hike.photos.forEach((file: File) => {
            formData.append('files', file);
        });
    }

    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    return Axios.post(process.env.REACT_APP_API_URL + '/hike', hike, config)
};

export const updateHike = (hike: Hike, onUploadProgress?: (axiosProgressEvent: AxiosProgressEvent) => void) => {
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    return Axios.put(process.env.REACT_APP_API_URL + '/hike:id', hike, config)
};

export const deleteHike = (hikeId: string) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        },
        params: {
            id: hikeId
        }
    };

    return Axios.delete(process.env.REACT_APP_API_URL + '/hike:id', config)
};

export const getHikers = async (): Promise<string[]> => {
    const config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    const response = await Axios.get(process.env.REACT_APP_API_URL + '/hiker', config)
    return response.data;
};
