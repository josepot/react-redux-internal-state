export const DIMENSIONS_UPDATED = 'DIMENSIONS_UPDATED';
export const MOVED_TO = 'MOVED_TO';
export const NEXT = 'NEXT';
export const PREV = 'PREV';
export const SLIDES_UPDATED = 'SLIDES_UPDATED';
export const TRANSITION_ENDED = 'TRANSITION_ENDED';

export const actionCreators = {
  onDimensionsUpdate:
    dimensions => ({ type: DIMENSIONS_UPDATED, payload: { dimensions } }),
  onMoveTo: (target) =>
    ({ type: MOVED_TO, payload: { target } }),
  onNext: () => ({ type: NEXT }),
  onPrev: () => ({ type: PREV }),
  onSlidesUpdate: slides => ({ type: SLIDES_UPDATED, payload: { slides } }),
  onTransitionEnd: () => ({ type: TRANSITION_ENDED }),
};
