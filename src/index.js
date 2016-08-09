import { PropTypes } from 'react';
import { compose, getContext, lifecycle, withContext, withProps } from 'recompose';
import {
  registerComponent, registerInstance, getComponentState,
  unregisterInstance, actionCreators, helpers,
} from 'redux-internal-state';
import { connect } from 'react-redux';

const contextProps = {
  parentInstanceIds: PropTypes.shape({
    componentId: PropTypes.string,
    instanceId: PropTypes.string,
  })
};

const type = val =>
  val === null      ? 'Null'      :
  val === undefined ? 'Undefined' :
  Object.prototype.toString.call(val).slice(8, -1);

function mapConnectArgs(args, componentId) {
  return args.map(
    (arg, idx) => {
      switch (idx) {
        case 0:
          return (state, props) => arg(
            getComponentState(componentId, props.instanceId, state),
            props
          );
        case 1:
          return (dispatch, props) =>
            type(args[1]) === 'Function' ? arg(
              helpers.getScopedDispatch(
                dispatch, componentId, props.instanceId
              ),
              props
            ) : helpers.bindScopedActionCreators(
              dispatch, componentId, props.instanceId, arg
            );
        default:
          return arg;
      };
    }
  );
}

export default (...args) => (component, id, reducer) => {
  registerComponent(id, reducer);

  return compose(
    getContext(contextProps),
    connect(() => ({}), {
      onRegister: actionCreators.registerInstanceAction,
      onUnregister: actionCreators.unregisterInstanceAction,
    }),
    lifecycle({
      componentWillMount() {
        registerInstance(id, this.props.instanceId);
        this.props.onRegister(
          id, this.props.instanceId, this.props.parentInstanceIds
        );
      },
      componentWillUnmount() {
        unregisterInstance(id, this.props.instanceId);
        this.props.onUnregister(id, this.props.instanceId);
      },
    }),
    connect(...mapConnectArgs(args, id)),
    withProps(
      ({ dispatch, instanceId }) => ({
        dispatch: dispatch && helpers.getScopedDispatch(dispatch, id, instanceId),
      })
    ),
    withContext(
      contextProps,
      ({ instanceId }) => ({ parentInstanceIds: { componentId: id, instanceId } })
    )
  )(component);
};
