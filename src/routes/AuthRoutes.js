import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'


//Import Screen
import CashierNavigator from './DrawerComponent/CashierNavigator'
import { fromLeft, flipX, flipY, zoomIn, zoomOut } from 'react-navigation-transitions';
import Home from '../screens/AuthScreen/Home';
import UpdateProfil from '../screens/AuthScreen/Drawer/UpdateProfil';
import CreatePIN from '../screens/AuthScreen/Drawer/CreatePIN';
import AkunNavigator from './DrawerComponent';



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
  AkunNavigator : {
    screen : AkunNavigator,
    navigationOptions : {
      header : null
    }
  }
}, tempNavigator), {
  initialRouteName: 'Home',
  // https://github.com/plmok61/react-navigation-transitions
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)


