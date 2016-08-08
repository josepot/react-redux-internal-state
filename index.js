import R from 'ramda';
import { PropTypes } from 'react';
import { compose, getContext, lifecycle, withContext, withProps, withState } from 'recompose';
import * as reduxComponents from 'redux-internal-state';
import { connect } from 'react-redux';

const contextProps = {
  parentInstanceIds: PropTypes.shape({
    componentId: PropTypes.string,
    instanceId: PropTypes.string,
  })
};

export default (component, id, reducer) => {
  reduxComponents.registerComponent(id, reducer);

  return (...args) => compose(
    getContext(contextProps),
    connect(()=>({}), {
      onRegister: reduxComponents.registerInstanceAction,
      onUnregister: reduxComponents.unregisterInstanceAction,
    }),
    lifecycle({
      componentWillMount() {
        reduxComponents.registerInstance(id, this.props.instanceId);
        this.props.onRegister(
          id, this.props.instanceId, this.props.parentInstanceIds
        );
      },
      componentWillUnmount() {
        reduxComponents.unregisterInstance(id, this.props.instanceId);
        this.props.onUnregister(id, this.props.instanceId);
      },
    }),
    connect(...mapConnectArgs(args)),
    withProps(
      ({ dispatch, instanceId }) => ({
        dispatch: dispatch && reduxComponents.getScopedDispatch(dispatch, id, instanceId),
      })
    ),
    withContext(
      contextProps,
      ({ instanceId }) => ({ parentInstanceIds: { componentId: id, instanceId } })
    )
  )(component);

  function mapConnectArgs(args) {
    return args.map(
      (arg, idx) => {
        switch(idx) {
          case 0:
            return (state, props) => arg(
              reduxComponents.getComponentState(id, props.instanceId, state),
              props
            );
          case 1:
            return (dispatch, props) =>
              R.type(args[1]) === 'Function' ? arg(
                reduxComponents.getScopedDispatch(
                  dispatch, id, props.instanceId
                ),
                props
              ) : reduxComponents.bindScopedActionCreators(
                dispatch, id, props.instanceId, arg
              );
          default:
            return arg;
        };
      }
    );
  }
};
