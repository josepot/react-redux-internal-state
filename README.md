React bindings for
[Redux-Internal-State](https://github.com/josepot/redux-internal-state)
A library that will help you manage the transient state of your react-redux
app.

# What is this about?

## The problem

When developing redux-apps: is it a good idea to keep all the state of your app
in the redux store? Should we also keep in our redux store the transient data
of our app and the "internal state" of your ui components? Do we want our UI
components to be able to manage their own state?

Let's imagine that we have a carousel component that receives the following
props from a container: `width` and `slides`. Shoudln't the carousel itself be
the one responsible for managing its internal state? (the slide that it's
currently visible, the transitions, etc?) Should we manage that state with
redux? Do we want to have that transient state it in the redux store? Could
there be a way to have both things at once: the carousel managing its internal
state and at the same time to keep that state in the redux-store?

This library will help you to do exactly that: allow your components to manage
their internal state and at the same time keep that state in the global store
without the component being aware of that.

## But why would I want to do that?

For a few different reasons:

1) Being able to manage the "internal state" of your compoenents using actions,
reducers and selectors implies that you won't need to make any mutations, all
the state management flow will be functional. Which will make your component
easier to test and easier to reason about.

2) Because it will make debugging a lot easier: You will be able to time
travel through the different events that affected the state of your component.

3) Because if all the state of your application lives in the redux-store you
will be able to reproduce any given state of your application by reproducing
the actions. As soon as you have a component that behaves independently from
the state of the redux-store, the state of your app will stop being
deterministic.

## How do I use this?

First lets install `redux-internal-state` and `react-redux-internal-state`:

```
npm install --save redux-internal-state react-redux-internal-state
```

Now let's add an entry in the main reducer of the app. Is in this entry where
the transient-state data  will be stored, for example:

```
import { combineReducers } from 'redux';
import reduxInternal from 'redux-internal-state';
import oneOfYourReducers from './oneOfYourReducers';

const INTERNAL_STATE_KEY = 'componentsTransientData';

export default combineReducers({
  [INTERNAL_STATE_KEY]: reduxInternal(INTERNAL_STATE_KEY),
  oneOfYourReducers,
  // ...
});
```

Now let's say that you want to create a component that manages its "internal state".
First define the actions that will trigger state changes:

```
// This file would be located somewhere like: src/components/tabs-component/actions.js

export const TAB_SELECTED = 'TAB_SELECTED';

export actionCreators = {
  onTabSelect: tabId => ({ type: TAB_SELECTED, payload: { tabId } })
};
```

Now let's make a simple reducer for the "internal state" of our component:
```
// This file would be located somewhere like: src/components/tabs-component/reducer.js

import { TAB_SELECTED } from './actions';

const INITIAL_STATE = 0;

export default (state = INITIAL_STATE, { type, payload }) =>
  type === TAB_SELECTED ? payload.tabId : state;

```

Next, lets say that you have a tabs component and that you need to receive
through props the dispatcher function that will be called when a new tab is
selected and the current state of your tabs component. You could do this:

```
// This file would be located somewhere like: src/components/tabs-component/index.js

import React from 'react';
import connect from 'react-redux-internal-state';
import reducer from './reducer';
import { actionCreators } from './actions';

const tabs = ({ selectedTab, onTabSelect, ...otherProps }) => (
  // Your code here
);

export default connect(
  state => ({ selectedTab: state.instance }),
  actionCreators
)(tabs, 'tabs', reducer);
```

## Installation

With npm:

    npm install --save react-redux-internal-state

With git:

    git clone git://github.com/josepot/react-redux-internal-state.git

## License

[MIT license](https://github.com/josepot/react-redux-internal-state/blob/master/LICENSE).
