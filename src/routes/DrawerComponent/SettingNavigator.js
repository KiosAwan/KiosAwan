import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import MenuSetting from '../../screens/AuthScreen/Drawer/Setting/MenuSetting'
import MenuSettingProfil from '../../screens/AuthScreen/Drawer/Setting/MenuSettingProfil'
import MenuSettingUbahEmail from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahEmail'
import MenuSettingUbahNoHP from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahNoHP'
import MenuSettingUbahPassword from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahPassword'
import MenuSettingLupaPIN from '../../screens/AuthScreen/Drawer/Setting/MenuSettingLupaPIN'

const SettingNavigator = createStackNavigator({
  MenuSetting: {
    screen: MenuSetting,
    navigationOptions: {
      header: null
    }
	},
	MenuSettingProfil: {
    screen: MenuSettingProfil,
    navigationOptions: {
      header: null
    }
	},
	MenuSettingUbahEmail: {
    screen: MenuSettingUbahEmail,
    navigationOptions: {
      header: null
    }
	},
	MenuSettingUbahNoHP: {
    screen: MenuSettingUbahNoHP,
    navigationOptions: {
      header: null
    }
	},
	MenuSettingUbahPassword: {
    screen: MenuSettingUbahPassword,
    navigationOptions: {
      header: null
    }
	},
	MenuSettingLupaPIN: {
    screen: MenuSettingLupaPIN,
    navigationOptions: {
      header: null
    }
	}	
})

export default createAppContainer(SettingNavigator)