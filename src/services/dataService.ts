import Axios, {AxiosProgressEvent, AxiosRequestConfig} from 'axios';

import {Hike, Hiker, HikeSearchParams, Photo} from '../models/models';

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

export const getHike = async (hikeId: string): Promise<Hike> => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    const response = await Axios.get(process.env.REACT_APP_API_URL + `/hike/${hikeId}`, config)
    return response.data;
};

export const createHike = async (hike: Hike, onUploadProgress?: (axiosProgressEvent: AxiosProgressEvent) => void) => {
    const formData = getFormData(hike);
    const config: AxiosRequestConfig = {
        headers: {
            'x-diht-agent': process.env.REACT_APP_USER_AGENT,
            'x-diht-trail': hike.trail,
            'x-diht-date-of-hike': hike.dateOfHike
        }
    };

    if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    const response = await Axios.post(process.env.REACT_APP_API_URL + '/hike', formData, config);
    return response.data;
};

export const updateHike = (hike: Hike, onUploadProgress?: (axiosProgressEvent: AxiosProgressEvent) => void) => {
    const formData = getFormData(hike);
    const config: AxiosRequestConfig = {
        headers: {
            'x-diht-agent': process.env.REACT_APP_USER_AGENT,
            'x-diht-trail': hike.trail,
            'x-diht-date-of-hike': hike.dateOfHike
        }
    };

    if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
    }

    return Axios.put(process.env.REACT_APP_API_URL + `/hike/${hike.id}`, formData, config)
};

export const deleteHike = (hikeId: string) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'x-diht-agent': process.env.REACT_APP_USER_AGENT
        }
    };

    return Axios.delete(process.env.REACT_APP_API_URL + `/hike/${hikeId}`, config)
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

const getFormData = (hike: Hike) => {
    const formData = new FormData();

    formData.append('trail', hike.trail);
    formData.append('dateOfHike', hike.dateOfHike);

    if (hike.conditions) {
        formData.append('conditions', hike.conditions);
    }

    if (hike.crowds) {
        formData.append('crowds', hike.crowds);
    }

    if (hike.description) {
        formData.append('description', hike.description);
    }

    if (hike.hikers && hike.hikers.length > 0) {
        formData.append('hikers', hike.hikers.map((hiker: Hiker) => hiker.fullName).join(','));
    }

    if (hike.tags) {
        formData.append('tags', hike.tags);
    }

    if (hike.link) {
        formData.append('link', hike.link);
    }

    if (hike.linkLabel) {
        formData.append('linkLabel', hike.linkLabel);
    }

    if (hike.photos) {
        hike.photos.forEach((photo: Photo) => {
            if (photo.file) {
                formData.append('files', photo.file);
            }
        });

        const photoMetadata = hike.photos.map((photo: Photo) => {
            if (photo.action) {
                return {
                    id: photo.id,
                    fileName: photo.fileName,
                    caption: photo.caption,
                    action: photo.action
                };
            } else {
                return undefined;
            }
        }).filter((metadata: any) => metadata);

        if (photoMetadata.length > 0) {
            formData.append('photos', JSON.stringify(photoMetadata));
        }
    }

    return formData;
};
