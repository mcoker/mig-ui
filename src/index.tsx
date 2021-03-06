import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { history } from './helpers';
import AppComponent from './app/AppComponent';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './configureStore';
const { persistor, store } = configureStore();
import { initMigMeta } from './mig_meta';
import { authOperations } from './app/auth/duck';

import Loader from 'react-loader-spinner';

import '@patternfly/react-core/dist/styles/base.css';
const onBeforeLift = () => {
  // take some action before the gate lifts
};
// Some amount of meta data is delievered to the app by the server
/* tslint:disable:no-string-literal */
const migMeta = window['_mig_meta'];
/* tslint:enable:no-string-literal */

// Load the meta into the redux tree if it was found on the window
// Will only be present in remote-dev and production scenarios where
// oauth meta must be loaded
if (!!migMeta) {
  store.dispatch(initMigMeta(migMeta));
  // TODO: Apparently store.dispatch has some known issues with the compiler
  // when passing it thunks. Need to come back around to this in the future.
  // @ts-ignore
  store.dispatch(authOperations.initFromStorage());
}

render(
  <Provider store={store}>
    <PersistGate
      loading={<Loader type="Puff" color="#00BFFF" height="100" width="100" />}
      onBeforeLift={onBeforeLift}
      persistor={persistor}
    >
      <ConnectedRouter history={history}>
        <AppComponent />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('root'),
);
