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


const UnauthNavigator = createStackNavigator({
  PhoneRegistration : {
    screen : PhoneRegistration,
    navigationOptions: {
      header : null
    }
  },
  Login : {
    screen : LoginVerification,
    navigationOptions : {
      header : null
    }
  },
  FirstPassword : {
    screen : FirstPassword,
    navigationOptions : {
      header : null
    }
  }, 
  SecondPassword : {
    screen : SecondPassword,
    navigationOptions : {
      header : null
    }
  },
  NameRegistration : {
    screen : NameRegistration,
    navigationOptions : {
      header : null
    }
  },
  ForgotPassword : {
    screen : ForgotPassword,
    navigationOptions : {
      header : null
    }
  },
  NewPassword1 : {
    screen : NewPassword1,
    navigationOptions : {
      header : null
    }
  },
  NewPassword2 : {
    screen : NewPassword2,
    navigationOptions : {
      header : null
    }
  }
})

export default createAppContainer(UnauthNavigator)

