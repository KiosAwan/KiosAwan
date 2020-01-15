import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'


//Import Screen
import CashierNavigator from './DrawerComponent/CashierNavigator'
import { fromLeft, flipX, flipY, zoomIn, zoomOut, fromBottom } from 'react-navigation-transitions';
import Home from '../screens/AuthScreen/Home';
import UpdateProfil from '../screens/AuthScreen/Drawer/UpdateProfil';
import CreatePIN from '../screens/AuthScreen/Drawer/CreatePIN';
import AkunNavigator from './DrawerComponent';
import VerifikasiEmail from '../screens/AuthScreen/Drawer/Temp/VerifikasiEmail';
import TransactionCetakStruk from 'src/screens/AuthScreen/Drawer/Transaction/TransactionCetakStruk';
import TambahPrinter from 'src/screens/AuthScreen/Drawer/Transaction/TambahPrinter';
import NewsScreen from 'src/screens/AuthScreen/NewsScreen';



const handleCustomTransition = ({ scenes }) => {
  const prevScene = scenes[scenes.length - 2];
  const nextScene = scenes[scenes.length - 1];

  if (prevScene && prevScene.route.routeName === 'Setting' && nextScene.route.routeName === 'Transaction') {
    return fromLeft(250);
  } else if (prevScene && prevScene.route.routeName === 'Home' && nextScene.route.routeName === 'CashierNavigator') {
    return fromBottom();
  }
  return fromLeft();
}

const tempNavigator = {
  '/temp/create-pin': {
    screen: CreatePIN,
    navigationOptions: {
      header: null
    }
  },
  '/temp/update-profile': {
    screen: UpdateProfil,
    navigationOptions: {
      header: null
    }
  },
  '/temp/verifikasi-email': {
    screen: VerifikasiEmail,
    navigationOptions: {
      header: null
    }
  }
}

const AuthNavigator = createStackNavigator(Object.assign({
  '/': {
    screen: Home,
    navigationOptions: {
      header: null
    }
  },
  '/cashier/index': {
    screen: CashierNavigator,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/index': {
    screen: AkunNavigator,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/cetakstruk': {
    screen: TransactionCetakStruk,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/transaction/tambahprinter': {
    screen: TambahPrinter,
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
}, tempNavigator), {
  initialRouteName: '/',
  // https://github.com/plmok61/react-navigation-transitions
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(AuthNavigator)


