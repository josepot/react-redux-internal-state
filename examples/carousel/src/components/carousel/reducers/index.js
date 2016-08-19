import { combineReducers } from 'redux';

import current from './current';
import dimensions from './dimensions';
import slides from './slides';
import targetDiff from './target-diff';
import INITIAL_STATE from './initial-state';

export default (state = INITIAL_STATE, action) => combineReducers({
  current: current(state.targetDiff, state.slides.length),
  targetDiff: targetDiff(state.current),
  slides,
  dimensions,
})(state, action);
