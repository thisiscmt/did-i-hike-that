export const isMobile = () => {
    return "ontouchstart" in document.documentElement;
};
