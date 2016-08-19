import { DIMENSIONS_UPDATED } from '../actions';
import initial from './initial-state';

export default (state = initial.dimensions, { type, payload }) =>
  type === DIMENSIONS_UPDATED ? payload.dimensions : state;
