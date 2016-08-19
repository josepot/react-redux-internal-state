/*
 _____________________________________________________
 |     |                                        |     |
 |  N  |                                        |  P  |
 |  E  |                                        |  R  |
 |  X  |                                        |  E  |
 |  T  |                                        |  V  |
 |     |                                        |     |
 |  B  |                 SLIDE                  |  B  |
 |  U  |                                        |  U  |
 |  T  |                                        |  T  |
 |  T  |                                        |  T  |
 |  O  |                                        |  O  |
 |  N  |                                        |  N  |
 |     |                                        |     |
 -----------------------------------------------------|
 |                                                    |
 |                   SLIDE BUTTONS                    |
 |                                                    |
 ------------------------------------------------------
 */

import R from 'ramda';
import { createSelector } from 'reselect';
import { getNSlides, getDimensions, toPx } from './common';
import { getContainerPositions, getPositionedSlides } from './positions';

const PROPORTIONS = {
  ARROW_BUTTONS_WIDTH: 1/12,
  SLIDE_BUTTONS_HEIGHT: 1/6,
  SLIDE_BUTTONS_TOP_BOTTON_MARGINS: 1/6,
};
const ARROW_BUTTONS_LATERAL_MARGIN = 5;
const SLIDE_BUTTONS_MIN_LATERAL_PADDING = 5;

export const getSlideDimensions = createSelector(
  [getDimensions, getNSlides],
  ({ width, height }, nSlides) => ({
    width: width * (1 - (PROPORTIONS.ARROW_BUTTONS_WIDTH * 2)),
    height: height * (1 - PROPORTIONS.SLIDE_BUTTONS_HEIGHT),
  })
);

export const getArrowButtonStyle = createSelector(
  [getDimensions, getSlideDimensions],
  ({ width }, { height: slideHeight }) => {
    const size = (width * PROPORTIONS.ARROW_BUTTONS_WIDTH);
    return {
      width: toPx(size - (ARROW_BUTTONS_LATERAL_MARGIN * 2)),
      height: toPx(size - (ARROW_BUTTONS_LATERAL_MARGIN * 2)),
      margin: toPx((slideHeight - size) / 2) + ' ' + // top-bottom
              toPx(ARROW_BUTTONS_LATERAL_MARGIN), // left-right
    };
  }
);

export const getSlideButtonsStyle = createSelector(
  [getDimensions, getSlideDimensions, getNSlides],
  ({ width, height }, { height: slideHeight }, nSlides) => {
    const areaHeight = height - slideHeight;
    const paddingTop =
      PROPORTIONS.SLIDE_BUTTONS_TOP_BOTTON_MARGINS * areaHeight;
    const slideButtonsMaxHeight = areaHeight - (paddingTop * 2);
    const slideButtonsMaxWidth =
      (width - (SLIDE_BUTTONS_MIN_LATERAL_PADDING * 2)) / nSlides;
    const slideButtonsAvailableSize =
      R.min(slideButtonsMaxWidth, slideButtonsMaxHeight);
    const slideButtonsSize = slideButtonsAvailableSize *
      (1 - (PROPORTIONS.SLIDE_BUTTONS_TOP_BOTTON_MARGINS * 2));
    const margin =
      slideButtonsAvailableSize * PROPORTIONS.SLIDE_BUTTONS_TOP_BOTTON_MARGINS;
    return {
      area: {
        width: toPx(slideButtonsAvailableSize * nSlides),
        height: toPx(areaHeight),
        paddingTop: toPx(paddingTop),
      },
      button: {
        margin: toPx(margin),
        width: toPx(slideButtonsSize),
        height: toPx(slideButtonsSize),
      },
    };
  }
);

export const getSlidesStyle = createSelector(
  [getPositionedSlides, getSlideDimensions],
  (slides, { width, height }) => slides.map(({ id, src, position }) => ({
    id,
    src,
    style: {
      width: toPx(width),
      height: toPx(height),
      left: toPx(position * width),
    }
  }))
);

export const getSlidesContainerStyle = createSelector(
  [getContainerPositions, getSlideDimensions],
  ({ activePosition, isInTransition, totalPositions }, { width, height }) => ({
    left: toPx(activePosition * width * -1),
    width: toPx(totalPositions * width),
    height: toPx(height),
    transitionProperty: isInTransition ? 'left' : undefined,
    transitionDuration: isInTransition ? undefined : '0s',
  })
);
