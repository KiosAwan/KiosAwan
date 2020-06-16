import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import PhoneRegistration from '../screens/Registration/PhoneRegistration'
import NameRegistration from '../screens/Registration/NameRegistration'
import FirstPassword from '../screens/Registration/FirstPassword'
import SecondPassword from '../screens/Registration/SecondPassword'
import ForgotPassword from '../screens/Registration/ForgotPassword'
import NewPassword1 from '../screens/Registration/NewPassword1'
import NewPassword2 from '../screens/Registration/NewPassword2'
import LoginVerification from '../screens/Registration/LoginVerification'
import TermCondition from 'src/screens/Registration/TermCondition'
import { fromLeft, fromRight } from 'react-navigation-transitions';
import OTPInput from 'src/screens/Registration/OTPInput'
import InputCode from 'src/components/Input/InputCode'

const handleCustomTransition = ({ scenes }) => {
  global.prevScene = scenes[scenes.length - 2];
  global.nextScene = scenes[scenes.length - 1];
  if (prevScene && prevScene.route.routeName === '/' && nextScene.route.routeName === '/drawer') {
    return fromLeft(250);
  }
  return fromRight();
}
const Navs = {
  '/unauth': {
    screen: PhoneRegistration,
    navigationOptions: {
      header: null
    }
  },
  '/input-code': {
    screen: InputCode,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/login': {
    screen: LoginVerification,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/login/forgot-password': {
    screen: ForgotPassword,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/login/forgot-password/new-password-1': {
    screen: NewPassword1,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/login/forgot-password/new-password-2': {
    screen: NewPassword2,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/registration': {
    screen: NameRegistration,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/registration/otp': {
    screen: OTPInput,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/registration/first-password': {
    screen: FirstPassword,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/registration/second-password': {
    screen: SecondPassword,
    navigationOptions: {
      header: null
    }
  },
  '/unauth/registration/term-condition': {
    screen: TermCondition,
    navigationOptions: {
      header: null
    }
  }
}
const UnauthNavigator = createStackNavigator(Navs, {
  initialRouteName: '/unauth',
  transitionConfig: nav => handleCustomTransition(nav),
})

export default createAppContainer(UnauthNavigator)

