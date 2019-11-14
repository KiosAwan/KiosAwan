import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import UnauthNavigator from './UnauthRoutes'
import CheckMember from './CheckMember'
import AuthNavigator from './AuthRoutes'
import AppIntro from '../screens/Registration/AppIntro'

const AppNavigator = createSwitchNavigator({
    UnauthNavigator,
    AuthNavigator,
    CheckMember,
    AppIntro
}, {
    initialRouteName: 'CheckMember'
  })


export default createAppContainer(AppNavigator)