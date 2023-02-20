import {RefObject} from 'react';
import {HikeSearchParams, Photo} from '../models/models';

export const getSearchParams = (searchText: string) => {
    const searchParams: HikeSearchParams = {};

    if (searchText) {
        if (searchText.toLowerCase().startsWith('date:')) {
            const index = searchText.indexOf('-');

            if (index > -1) {
                searchParams.startDate = searchText.slice(5, index).trim();
                searchParams.endDate = searchText.slice(index + 1).trim();
            } else {
                searchParams.startDate = searchText.slice(5).trim();
            }
        } else {
            searchParams.searchText = searchText
        }
    }

    return searchParams;
};

export const getFileNameForPhoto = (photo: Photo) => {
    let fileName = '';

    if (photo.fileName) {
        fileName = photo.fileName;
    } else if (photo.filePath) {
        const index = photo.filePath.indexOf('/');

        if (index > -1) {
            fileName = photo.filePath.slice(index + 1);
        }
    }

    return fileName;
};

export const formatDateOfHike = (dateOfHike: string) => {
    const dateParts = dateOfHike.split('-');
    return `${Number(dateParts[1])}/${Number(dateParts[2])}/${dateParts[0]}`;
};

export const scrollToTop = (ref: RefObject<HTMLElement>) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView();
    }
}
