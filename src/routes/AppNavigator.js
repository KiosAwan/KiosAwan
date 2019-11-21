import { createAppContainer, createSwitchNavigator} from 'react-navigation';

import UnauthNavigator from './UnauthRoutes'
import CheckMember from './CheckMember'
import AuthNavigator from './AuthRoutes'
import AppIntro from '../screens/Registration/AppIntro'
import AddProfile from '../screens/AuthScreen/AddProfile';

const AppNavigator = createSwitchNavigator({
    UnauthNavigator,
    AuthNavigator,
    CheckMember,
    AppIntro,
    InitProfile : AddProfile
}, {
    initialRouteName: 'CheckMember'
  })


export default createAppContainer(AppNavigator)