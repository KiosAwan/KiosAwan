import AppNavigator from './src/routes/AppNavigator'

import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from './src/redux/store'

export default class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <AppNavigator/>
      </Provider>
    );
  }
}


