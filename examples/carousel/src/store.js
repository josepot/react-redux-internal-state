import { createStore, compose } from 'redux';
import rootReducer from './reducer';

export default compose(
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore)(rootReducer);
