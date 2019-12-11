import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AsyncStorage from '@react-native-community/async-storage'


//Import Screen
import MainNavigator from './DrawerComponent/MainNavigator'
import TransactionNavigator from './DrawerComponent/TransactionNavigator';
import { fromLeft, flipX, flipY, zoomIn, zoomOut } from 'react-navigation-transitions';
import Setting from '../screens/AuthScreen/Setting';


const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (prevScene && prevScene.route.routeName === 'Setting' && nextScene.route.routeName === 'Transaction') {
    return zoomIn(250);
  } else if (prevScene && prevScene.route.routeName === 'Transaction' && nextScene.route.routeName === 'Setting') {
    return flipX();
  }
  return fromLeft();
}

const AuthNavigator = createStackNavigator({
  Main: {
    screen: MainNavigator,
    navigationOptions: {
      header: null
    }
  },
  Transaction: {
    screen: TransactionNavigator,
    navigationOptions: {
      header: null
    }
  },
  Setting: {
    screen: Setting,
    navigationOptions: {
      header: null
    }
  },
}, {
  initialRouteName: 'Main',
  // https://github.com/plmok61/react-navigation-transitions
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)


