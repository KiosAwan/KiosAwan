import './src/utils/default'
import AppNavigator from './src/routes/AppNavigator'
import React, { Component, useEffect } from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux'
import store from './src/redux/store'
import { Deeplink } from './src/routes/Deeplink';
import { Root } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal'

const prefix = 'awanapp://';
export default class App extends Component {
  componentDidMount() {
    OneSignal.init("401b51c9-664d-45cb-8630-4bb301ffd9fa");
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    Linking.getInitialURL().then(Deeplink).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  async onIds(device) {
    await AsyncStorage.setItem('@push_token', device.pushToken)
  }
  _handleOpenURL(event) {
    Deeplink(event.url)
  }
  render() {
    return (
      <Root>
        <Provider store={store}>
          <AppNavigator uriPrefix={prefix} />
        </Provider>
      </Root>
    );
  }
}


