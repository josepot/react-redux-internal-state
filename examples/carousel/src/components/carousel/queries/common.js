import R from 'ramda';

export const toPx = val => val + 'px';
export const getCurrent = R.path(['instance', 'current']);
export const getDimensions = R.path(['instance', 'dimensions']);
export const getNSlides = R.path(['instance', 'slides', 'length']);
