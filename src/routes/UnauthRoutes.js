import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

//Import Screen
import PhoneRegistration from '../screens/Registration/PhoneRegistration'
import NameRegistration from '../screens/Registration/NameRegistration'
import FirstPIN from '../screens/Registration/FirstPIN'
import SecondPIN from '../screens/Registration/SecondPIN'


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

})

export default createAppContainer(UnauthNavigator)

