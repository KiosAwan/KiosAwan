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
import SplashScreen from 'react-native-splash-screen'
import * as Sentry from '@sentry/react-native';
const prefix = 'awanapp://';
export default class App extends Component {
  constructor(properties) {
    super(properties);
    OneSignal.init("401b51c9-664d-45cb-8630-4bb301ffd9fa");
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', this.onIds);
    Sentry.init({
      dsn: 'https://b0a17f87bf17433493ede939075e84ac@o410762.ingest.sentry.io/5285053',
    });
  }
  componentDidMount() {
    Linking.getInitialURL().then(Deeplink).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
    
    SplashScreen.hide()
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  async onIds(device) {
    await AsyncStorage.setItem('@push_token', device.userId)
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


