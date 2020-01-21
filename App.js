import './src/utils/default'
import AppNavigator from './src/routes/AppNavigator'
import React, { Component, useEffect } from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { Deeplink } from './src/routes/Deeplink';

const prefix = 'awanapp://';
export default class App extends Component {
  componentDidMount() {
    Linking.getInitialURL().then(Deeplink).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  _handleOpenURL(event) {
    Deeplink(event.url)
  }
  render() {
    return (
      <Provider store={store}>
        <AppNavigator uriPrefix={prefix} />
      </Provider>
    );
  }
}


