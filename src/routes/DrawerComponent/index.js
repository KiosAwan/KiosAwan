import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import TransactionNavigator from './TransactionNavigator';
import SettingNavigator from './SettingNavigator';
import ManajemenNavigator from './ManajemenNavigator';
import Akun from 'src/screens/AuthScreen/Drawer'
import Report from 'src/screens/AuthScreen/Drawer/Report'
import FAQ from 'src/screens/AuthScreen/Drawer/FAQ';
import Help from 'src/screens/AuthScreen/Drawer/Help';

const AkunNavigator = createStackNavigator({
    '/drawer': {
        screen: Akun,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/transaction/index': {
        screen: TransactionNavigator,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/settings/index': {
        screen: SettingNavigator,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/manajemen/index': {
        screen: ManajemenNavigator,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/laporan': {
        screen: Report,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/faq': {
        screen: FAQ,
        navigationOptions: {
            header: null
        }
    },
    '/drawer/help': {
        screen: Help,
        navigationOptions: {
            header: null
        }
    },
})

export default createAppContainer(AkunNavigator)