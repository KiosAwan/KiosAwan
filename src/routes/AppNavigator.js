import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import UnauthNavigator from './UnauthRoutes'
import CheckMember from './CheckMember'
import AuthNavigator from './AuthRoutes'

const AppNavigator = createSwitchNavigator({
    UnauthNavigator,
    AuthNavigator,
    CheckMember
}, {
    initialRouteName: 'CheckMember'
  })


export default createAppContainer(AppNavigator)