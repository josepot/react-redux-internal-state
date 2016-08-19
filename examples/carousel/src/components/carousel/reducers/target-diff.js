import { MOVED_TO, NEXT, PREV, TRANSITION_ENDED } from '../actions';
import initial from './initial-state';

export default current => (state = initial.targetDiff, { type, payload }) => {
  switch (type) {
    case MOVED_TO: return (payload.target - current);
    case NEXT: return 1;
    case PREV: return -1;
    case TRANSITION_ENDED: return 0;
    default: return state;
  };
};
