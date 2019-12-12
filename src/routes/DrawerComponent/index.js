import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Akun from '../../screens/AuthScreen/Drawer'
import TransactionNavigator from './TransactionNavigator'
import SettingNavigator from './SettingNavigator'

const AkunNavigator = createStackNavigator({
    Akun: {
        screen: Akun,
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
    SettingNavigator: {
        screen: SettingNavigator,
        navigationOptions: {
            header: null
        }
    },
})

export default createAppContainer(AkunNavigator)