import R from 'ramda';
import React from 'react';
import { lifecycle } from 'recompose';
import connect from 'react-redux-internal-state';

import { actionCreators } from './actions';
import stateToProps from './queries/state-to-props';
import reducer from './reducers';
import initialState from './reducers/initial-state';
import './styles.css';

const carousel = ({
  slides, activeSlide,
  styles: {
    arrowButton, container, slideButtons, slidesViewPort, slidesContainer,
  },
  onDimensionsUpdate, onMoveTo, onNext, onPrev, onSlidesUpdate, onTransitionEnd,
}) => (
  <div className="carousel" style={ container }>
    <div className="slidesArea">
      <div onClick={ onPrev } className="circle" style={ arrowButton }>
        &larr;
      </div>
      <div className="slidesViewPort" style={ slidesViewPort }>
        <ul style={ slidesContainer } onTransitionEnd={ onTransitionEnd }>
        {
          slides.map(({ src, id, style, alt }, idx) =>
            <li style={ style } key={ idx }>
              <img src={ src } alt={ alt } style={ R.pick(['width', 'height'], style) } />
            </li>
          )
        }
        </ul>
      </div>
      <div onClick={ onNext } className="circle" style={ arrowButton }>
        &rarr;
      </div>
    </div>
    <ul className="slideButtons" style={ slideButtons.area }>
      {
        slides.map(({ id }) =>
          <li
            key={ id }
            className={ 'circle' + (id === activeSlide? ' selected' : '') }
            onClick={ () => id !== activeSlide && onMoveTo(id) }
            style={ slideButtons.button }>
          </li>
        )
      }
    </ul>
  </div>
);

const carouselEnhanced = lifecycle({
  componentWillReceiveProps({ width, height, slidesSrc }) {
    if (!R.equals(slidesSrc, this.props.slidesSrc)) {
      this.props.onSlidesUpdate(slidesSrc);
    }

    if (width !== this.props.width || height !== this.props.height) {
      this.props.onDimensionsUpdate({ width, height });
    }
  }
})(carousel);

export default connect(stateToProps, actionCreators)(
  carouselEnhanced,
  'carousel',
  reducer,
  ({ slidesSrc, width, height }) => R.merge(initialState, {
    slides: slidesSrc,
    dimensions: { width, height },
  })
);
