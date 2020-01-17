import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import CashierNavigator from './DrawerComponent/CashierNavigator'
import { fromLeft, flipX, flipY, zoomIn, zoomOut, fromBottom } from 'react-navigation-transitions';
import Home from '../screens/AuthScreen/Home';
import NewsScreen from 'src/screens/AuthScreen/NewsScreen';
import PPOBNavigator from './PPOBNavigator';
import TempNavigator from './TempNavigator';
import DrawerNavigation from './DrawerNavigator';

const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];
  if (prevScene && prevScene.route.routeName === '/' && nextScene.route.routeName === '/drawer') {
    return fromLeft(250);
  }
  return fromBottom();
}

const Navs = {
  '/': {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  '/news-screen': {
    screen: NewsScreen,
    navigationOptions: {
      header: null
    }
  },
  ...CashierNavigator,
  ...DrawerNavigation,
  ...PPOBNavigator,
  ...TempNavigator
}
// https://github.com/plmok61/react-navigation-transitions
const AuthNavigator = createStackNavigator(Navs, {
  initialRouteName: '/',
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)


