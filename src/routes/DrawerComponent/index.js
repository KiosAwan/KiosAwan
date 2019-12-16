import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Akun from '../../screens/AuthScreen/Drawer'
import TransactionNavigator from './TransactionNavigator'
import SettingNavigator from './SettingNavigator'
import ManajemenNavigator from './ManajemenNavigator'

const AkunNavigator = createStackNavigator({
    // /drawer
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
    }
})

export default createAppContainer(AkunNavigator)