import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import UnauthNavigator from './UnauthRoutes'
import CheckMember from './CheckMember'
import AuthNavigator from './AuthRoutes'
import AppIntro from '../screens/Registration/AppIntro'

const AppNavigator = createSwitchNavigator({
    UnauthNavigator,
    AuthNavigator,
    '/splashscreen': CheckMember,
    '/intro': AppIntro
  }, {
    initialRouteName: '/splashscreen'
  })


export default createAppContainer(AppNavigator)