import {RefObject} from 'react';

export const isMobile = () => {
    return "ontouchstart" in document.documentElement;
};

export const scrollToTop = (ref: RefObject<HTMLElement>) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView();
    }
}
