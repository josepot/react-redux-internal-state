import R from 'ramda';
import { createStructuredSelector } from 'reselect';

import { getCurrent, getDimensions, toPx } from './common';
import * as styles from './styles';

export default createStructuredSelector({
  slides: styles.getSlidesStyle,
  activeSlide: getCurrent,
  styles: createStructuredSelector({
    arrowButton: styles.getArrowButtonStyle,
    container: R.compose(R.map(toPx), getDimensions),
    slideButtons: styles.getSlideButtonsStyle,
    slidesViewPort: R.compose(R.map(toPx), styles.getSlideDimensions),
    slidesContainer: styles.getSlidesContainerStyle,
  })
});
