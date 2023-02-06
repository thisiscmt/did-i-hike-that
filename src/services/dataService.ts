import Axios, {AxiosProgressEvent, AxiosRequestConfig} from 'axios';

import {Hike, HikeSearchParams, Photo} from '../models/models';

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


    const response = await Axios.get(process.env.REACT_APP_API_URL + `/hike/${hikeId}`, config)
    return response.data;
};

export const createHike = async (hike: Hike, onUploadProgress?: (axiosProgressEvent: AxiosProgressEvent) => void) => {
    const formData = new FormData();
    formData.append('trail', hike.trail);
    formData.append('dateOfHike', hike.dateOfHike);

    if (hike.notes) {
        formData.append('description', hike.notes);
    }

    if (hike.link) {
        formData.append('link', hike.link);
    }

    if (hike.conditions) {
        formData.append('conditions', hike.conditions);
    }

    if (hike.crowds) {
        formData.append('crowds', hike.crowds);
    }

    if (hike.tags && hike.tags.length > 0) {
        formData.append('tags', hike.tags.join(','));
    }

    if (hike.hikers && hike.hikers.length > 0) {
        formData.append('hikers', hike.hikers.join(','));
    }

    if (hike.photos) {
        hike.photos.forEach((photo: Photo) => {
            formData.append('files', photo.file);
        });
    }

    const config: AxiosRequestConfig = {
        headers: {
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    const response = await Axios.post(process.env.REACT_APP_API_URL + '/hike', formData, config);
    return response.data;
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
