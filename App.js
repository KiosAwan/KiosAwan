import AppNavigator from './src/routes/AppNavigator'

import React, { Component } from 'react';
import { Linking } from 'react-native';
import { Provider } from 'react-redux'
import store from './src/redux/store'


const prefix = 'mychat://';
let url = "awanapp://open?a=123&b=32846&c=6847bsdfj"

console.log(url.getParamFromUrl())

export default class App extends Component {
  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      // alert(url)
    }).catch(err => console.error('An error occurred', err));
    Linking.addEventListener('url', this._handleOpenURL);
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  _handleOpenURL(event) {
    // alert(event.url)
    console.log(event.url);
  }
  render() {
    return (
      <Provider store={store}>
        <AppNavigator uriPrefix={prefix} />
      </Provider>
    );
  }
}


