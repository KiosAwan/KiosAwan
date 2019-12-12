import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import AsyncStorage from '@react-native-community/async-storage'


//Import Screen
import CashierNavigator from './DrawerComponent/CashierNavigator'
import TransactionNavigator from './DrawerComponent/TransactionNavigator';
import { fromLeft, flipX, flipY, zoomIn, zoomOut } from 'react-navigation-transitions';
import Setting from '../screens/AuthScreen/Drawer';
import Home from '../screens/AuthScreen/Home';
import UpdateProfil from '../screens/AuthScreen/Drawer/UpdateProfil';
import CreatePIN from '../screens/AuthScreen/Drawer/CreatePIN';
import SettingNavigator from './DrawerComponent/SettingNavigator';



const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (prevScene && prevScene.route.routeName === 'Setting' && nextScene.route.routeName === 'Transaction') {
    return fromLeft(250);
  } else if (prevScene && prevScene.route.routeName === 'Transaction' && nextScene.route.routeName === 'Setting') {
    return flipX();
  }
  return fromLeft();
}

const tempNavigator = {
  CreatePIN: {
    screen: CreatePIN,
    navigationOptions: {
      header: null
    }
  },
  UpdateProfil: {
    screen: UpdateProfil,
    navigationOptions: {
      header: null
    }
  }
}

const AuthNavigator = createStackNavigator(Object.assign({
  Home: {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  CashierNavigator: {
    screen: CashierNavigator,
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
}, tempNavigator), {
  initialRouteName: 'Home',
  // https://github.com/plmok61/react-navigation-transitions
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)


