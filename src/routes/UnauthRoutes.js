import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import PhoneRegistration from '../screens/Registration/PhoneRegistration'
import NameRegistration from '../screens/Registration/NameRegistration'
import FirstPIN from '../screens/Registration/FirstPIN'
import SecondPIN from '../screens/Registration/SecondPIN'
import ForgotPIN from '../screens/Registration/ForgotPIN'
import NewPIN1 from '../screens/Registration/NewPIN1'
import NewPIN2 from '../screens/Registration/NewPIN2'


const UnauthNavigator = createStackNavigator({
  PhoneRegistration : {
    screen : PhoneRegistration,
    navigationOptions: {
      header : null
    }
  },
  FirstPIN : {
    screen : FirstPIN,
    navigationOptions : {
      header : null
    }
  }, 
  SecondPIN : {
    screen : SecondPIN,
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
  ForgotPIN : {
    screen : ForgotPIN,
    navigationOptions : {
      header : null
    }
  },
  NewPIN1 : {
    screen : NewPIN1,
    navigationOptions : {
      header : null
    }
  },
  NewPIN2 : {
    screen : NewPIN2,
    navigationOptions : {
      header : null
    }
  }
})

export default createAppContainer(UnauthNavigator)

