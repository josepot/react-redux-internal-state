import R from 'ramda';
import { createSelector, createStructuredSelector } from 'reselect';
import { getNSlides, getCurrent } from './common';

const getSlides = R.path(['instance', 'slides']);
const getTargetDiff = R.path(['instance', 'targetDiff']);

const getNSlidesAtTheRight = createSelector(
  [getNSlides],
  nSlides => Math.ceil(nSlides / 2)
)
const getInitialPaddingRight = createSelector(
  [getNSlidesAtTheRight],
  R.dec
);

const getStoppedOffset = createSelector(
  [getCurrent, getInitialPaddingRight],
  R.subtract
);

const getMotionOffset = createSelector(
  [getInitialPaddingRight, getTargetDiff, getNSlidesAtTheRight],
  (initialPaddingRight, targetDiff, rightSlides) => targetDiff < 0 ?
    Math.min(0, targetDiff + initialPaddingRight) :
    Math.max(0, targetDiff - rightSlides)
);

const getTotalOffset = createSelector(
  [getStoppedOffset, getMotionOffset],
  R.add
);

const getPaddingRight = createSelector(
  [getInitialPaddingRight, getMotionOffset],
  R.subtract
);

const getPaddingLeft = createSelector(
  [getNSlides, getPaddingRight],
  R.compose(R.dec, R.subtract)
);

const getContainerActivePosition = createSelector(
  [getNSlides, getTargetDiff],
  R.compose(R.dec, R.add)
);

const getTotalNumberPositions = createSelector(
  [getNSlides],
  R.compose(R.dec, R.multiply(2))
);

const getIsInTransition = createSelector(
  [getTargetDiff],
  targetDiff => targetDiff !== 0
);

export const getContainerPositions = createStructuredSelector({
  activePosition: getContainerActivePosition,
  isInTransition: getIsInTransition,
  totalPositions: getTotalNumberPositions,
});

export const getPositionedSlides = createSelector(
  [getSlides, getPaddingLeft, getTotalOffset],
  (slides, paddingLeft, offset) => slides.map((src, idx) => ({
    id: idx,
    src,
    position: paddingLeft + R.mathMod(idx - offset, slides.length),
  }))
);
