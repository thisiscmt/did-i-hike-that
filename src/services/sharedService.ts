import {RefObject} from 'react';
import {Photo} from '../models/models';

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
