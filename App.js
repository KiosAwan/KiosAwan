import './src/utils/default'
import UserInactivity from 'react-native-user-inactivity';
import store from './src/redux/store'
import SplashScreen from 'react-native-splash-screen'
import React, { useEffect } from 'react';
import onInactive, { inActiveTimer } from 'src/utils/onInactive';
import OneSignal from 'react-native-onesignal'
import BackgroundTimer from 'react-native-user-inactivity/lib/BackgroundTimer';

import AppNavigator from './src/routes/AppNavigator'
import * as Sentry from '@sentry/react-native';
import { Root } from 'native-base';
import { Provider } from 'react-redux'
import { Linking } from 'react-native';
import { Deeplink } from './src/routes/Deeplink';
import Storage from 'src/utils/keyStores';

const prefix = 'awanapp://';

const App = () => {
  const _handleOpenURL = event => {
    Deeplink(event.url)
  }
  const onIds = async device => {
    await Storage.setItem('@push_token', device.userId)
  }
  useEffect(() => {
    Sentry.init({
      dsn: 'https://b0a17f87bf17433493ede939075e84ac@o410762.ingest.sentry.io/5285053',
    });
    OneSignal.init("401b51c9-664d-45cb-8630-4bb301ffd9fa");
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', onIds);
    Linking.getInitialURL().then(Deeplink).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);
    SplashScreen.hide()
    return () => {
      OneSignal.removeEventListener('ids', onIds);
      Linking.removeEventListener('url', _handleOpenURL);
    }
  }, [])
  return <Root>
    <Provider store={store}>
      <UserInactivity
        timeForInactivity={inActiveTimer}
        timeoutHandler={BackgroundTimer}
        onAction={onInactive}>
        <AppNavigator uriPrefix={prefix} />
      </UserInactivity>
    </Provider>
  </Root>
}

export default App