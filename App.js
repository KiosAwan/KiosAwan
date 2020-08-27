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
import { isEmulator } from 'react-native-device-info';
import { Button } from 'src/components/Button/Button';
import analytics, { firebase } from '@react-native-firebase/analytics';

const prefix = 'awanapp://';

const App = () => {
  const _handleOpenURL = event => {
    Deeplink(event.url)
  }
  const onIds = async device => {
    const isEmu = await isEmulator()
    if (isEmu)
      if (__DEV__) await Storage.setItem('@push_token', 'pushtokenemulator')
    if (device) await Storage.setItem('@push_token', device.userId)
  }
  useEffect(() => {
    firebase.initializeApp({
      apiKey: 'AIzaSyDZBeiXadB3XfhZemEahWCwSkm7MTOw2co',
      appId: '1:348912587028:android:68845fdbc6a8ff07dbb201',
      databaseURL: 'https://awanfirebase-406a1.firebaseio.com',
      messagingSenderId: '348912587028',
      projectId: 'awanfirebase-406a1',
      storageBucket: 'awanfirebase-406a1.appspot.com'
    })
    Sentry.init({
      dsn: 'https://b0a17f87bf17433493ede939075e84ac@o410762.ingest.sentry.io/5285053',
    });
    OneSignal.init("401b51c9-664d-45cb-8630-4bb301ffd9fa");
    OneSignal.inFocusDisplaying(2);
    OneSignal.addEventListener('ids', onIds);
    Linking.getInitialURL().then(Deeplink).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', _handleOpenURL);
    SplashScreen.hide()
    onIds()
    return () => {
      OneSignal.removeEventListener('ids', onIds);
      Linking.removeEventListener('url', _handleOpenURL);
    }
  }, [])
  return <Root>
    <Button onPress={() => {
      analytics().setCurrentScreen('djhsdh', 'djhsdh')
      analytics().logEvent('basket', {
        id: 3745092,
        item: 'mens grey t-shirt',
        description: ['round neck', 'long sleeved'],
        size: 'L',
      })
    }}>hd</Button>
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