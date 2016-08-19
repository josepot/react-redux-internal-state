import { SLIDES_UPDATED } from '../actions';
import initial from './initial-state';

export default (state = initial.slides, { type, payload: { slides } = {} }) =>
  type === SLIDES_UPDATED ? slides : state;
