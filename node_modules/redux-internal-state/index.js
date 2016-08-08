import R from 'ramda';
import { combineReducers } from 'redux';

let clients = {};
let rootKey;

const DEFAULT_ROOT_KEY = 'componentsInternalState';

const REGISTER_INSTANCE = 'REDUX-COMPONENTS/REGISTER_INSTANCE';
const PARENT_INSTANCE = 'REDUX-COMPONENTS/PARENT_INSTANCE';
const UNREGISTER_INSTANCE = 'REDUX-COMPONENTS/UNREGISTER_INSTANCE';

export const COMPONENT_ACTION = 'REDUX-COMPONENTS/COMPONENT_ACTION';
export const componentAction = (componentId, instanceIds, instanceAction) => ({
  type: COMPONENT_ACTION,
  payload: {
    componentId,
    instanceIds,
    instanceAction,
  },
});
export const registerInstanceAction = (componentId, instanceId, parent) => ({
  type: REGISTER_INSTANCE,
  payload: { componentId, instanceId, parent },
});
export const parentInstanceAction = (componentId, instanceId, parent) => ({
  type: PARENT_INSTANCE,
  payload: { componentId, instanceId, parent },
});
export const unregisterInstanceAction = (componentId, instanceId) => ({
  type: UNREGISTER_INSTANCE,
  payload: { componentId, instanceId },
});

export const getScopedDispatch = (dispatch, componentId, instanceId) => action =>
  R.compose(dispatch, componentAction)(componentId, [instanceId], action);

export const bindScopedActionCreators =
  (dispatch, componentId, instanceId, scopedActionCreators) => R.map(
    scopedActionCreator => (...args) => dispatch(
      componentAction(componentId, [instanceId], scopedActionCreator(args))
    )
  )(scopedActionCreators);

export const registerComponent = (componentId, reducer) => {
  clients[componentId] = {
    reducer,
    lastInstanceId: 0,
    instances: new Set(),
  };
};

export const getInstanceId =
  componentId => '_AUTO_ID_' + clients[componentId].lastInstanceId++;

export const registerInstance = (componentId, instanceId) => {
  const client = clients[componentId];
  if (!client) throw new Error(`Component: "${componentId}" is not registered`);
  if (client.instances.has(instanceId)) throw new Error(`Duplicate instance ${instanceId}`);

  return client.instances.add(instanceId);
};

export const unregisterInstance = (componentId, instanceId) => {
  const client = clients[componentId];
  if (!client) throw new Error(`Component: "${componentId}" is not registered`);
  if (!client.instances.has(instanceId)) throw new Error(`Unexisting instance: ${instanceId}`);

  return client.instances.delete(instanceId);
};

const componentReducerEnhancer = (componentId, reducer) => (
  state = {}, { type, payload = {} }
) => {
  if (payload.componentId !== componentId) return state;

  switch(type) {
    case REGISTER_INSTANCE: return R.assoc(
      payload.instanceId, reducer(state[payload.instanceId], {}), state
    );
    case COMPONENT_ACTION: return R.merge(
      state,
      R.compose(
        R.mergeAll,
        R.map(id => ({[id]: reducer(state[id], payload.instanceAction) }))
      )(payload.instanceIds)
    );
    case UNREGISTER_INSTANCE:
      return R.dissoc(payload.instanceId, state);
    default:
      return state;
  };
}

const getComponentsReducer = () => R.compose(
  combineReducers,
  R.mapObjIndexed(({ reducer }, componentId) =>
    componentReducerEnhancer(componentId, reducer)
  ),
  R.filter(({ reducer }) => !!reducer),
)(clients);

const componentsTreeReducer = (state = {}, { type, payload: { componentId, instanceId, parent } = {} }) => {
  switch(type) {
    case UNREGISTER_INSTANCE:
      return R.dissocPath([componentId, instanceId], state);
    case REGISTER_INSTANCE:
      return R.compose(
        parent ?
          R.assocPath([parent.componentId, parent.instanceId, 'children', componentId, instanceId], instanceId) :
          R.identity,
        R.assocPath([componentId, instanceId], { parent, children: {} })
      )(state);
    case PARENT_INSTANCE: return R.assocPath(
      [parent.componentId, parent.instanceId, 'children', componentId, instanceId],
      instanceId, state
    );
    default: return state;
  };
};

export default (key = DEFAULT_ROOT_KEY) => {
  rootKey = key;
  return combineReducers({
    states: getComponentsReducer(),
    tree: componentsTreeReducer,
  });
}

export function getComponentState(componentId, instanceId, storeState) {
  return {
    instance: R.path([rootKey, 'states', componentId, instanceId], storeState),
    children: R.compose(
      R.mapObjIndexed((instances, componentId) => R.map(
        instanceId => getComponentState(componentId, instanceId, storeState),
        instances
      )),
      R.path([rootKey, 'tree', componentId, instanceId, 'children']),
    )(storeState),
  };
}
