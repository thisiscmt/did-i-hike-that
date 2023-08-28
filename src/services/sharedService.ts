import { RefObject } from 'react';
import Resizer from 'react-image-file-resizer';

import { HikeSearchParams } from '../models/models';

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

export const getThumbnailSrc = (filePath: string) => {
    let thumbnailSrc = '/images/no_hike_images.png';

    if (filePath) {
        const photoExt = filePath.split('.').pop() || '';
        thumbnailSrc = `${process.env.REACT_APP_API_URL}/images/` + filePath.replace(`.${photoExt}`, `_thumbnail.${photoExt}`);
    }

    return thumbnailSrc;
};

export const getThumbnailDataSrc = (file: File, maxSize: number) => new Promise<string>(resolve => {
    Resizer.imageFileResizer(file, maxSize, maxSize, 'JPEG', 100, 0,
        uri => {
            resolve(uri as string);
        }, 'base64' );
});

export const formatDateValue = (date: string) => {
    const dateParts = date.split('-');
    return `${Number(dateParts[1])}/${Number(dateParts[2])}/${dateParts[0]}`;
};

export const scrollToTop = (ref: RefObject<HTMLElement>) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView();
    }
}
