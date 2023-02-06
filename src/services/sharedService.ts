import {RefObject} from 'react';
import {Photo} from '../models/models';

export const isMobile = () => {
    return "ontouchstart" in document.documentElement;
};

export const getFileNameForPhoto = (photo: Photo) => {
    let fileName = '';

    if (photo.fileName) {
        fileName = photo.fileName;
    } else if (photo.filePath) {
        const index = photo.filePath.indexOf('/');

        if (index > -1) {
            fileName = photo.filePath.slice(index);
        }
    }

    return fileName;
};

export const scrollToTop = (ref: RefObject<HTMLElement>) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView();
    }
}
