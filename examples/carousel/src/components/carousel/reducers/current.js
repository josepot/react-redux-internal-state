import R from 'ramda';
import { TRANSITION_ENDED } from '../actions';
import initial from './initial-state';

export default (targetDiff, nSlides) =>
  (state = initial.current, { type }) =>
    type === TRANSITION_ENDED ? R.mathMod(state + targetDiff, nSlides) : state;
