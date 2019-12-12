import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Setting from '../../screens/AuthScreen/Drawer';
import MenuSetting from '../../screens/AuthScreen/Drawer/Setting/MenuSetting'
import MenuSettingProfil from '../../screens/AuthScreen/Drawer/Setting/MenuSettingProfil'
import MenuSettingUbahEmail from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahEmail'
import MenuSettingUbahNoHP from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahNoHP'
import MenuSettingUbahPassword from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahPassword'
import MenuSettingLupaPIN from '../../screens/AuthScreen/Drawer/Setting/MenuSettingLupaPIN'
import ForgotPINNewPIN from '../../screens/AuthScreen/Drawer/Setting/ForgotPINNewPIN'
import ForgotPINOTP from '../../screens/AuthScreen/Drawer/Setting/ForgotPINOTP'
import ChangePINNewPIN from '../../screens/AuthScreen/Drawer/Setting/ChangePINNewPIN';
import ChangePINInputPwd from '../../screens/AuthScreen/Drawer/Setting/ChangePINInputPwd';

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
  },
  ForgotPINNewPIN : {
    screen : ForgotPINNewPIN,
    navigationOptions : {
      header : null
    }
  },
  ForgotPINOTP : {
    screen : ForgotPINOTP,
    navigationOptions : {
      header : null
    }
  },
  ChangePINNewPIN : {
    screen : ChangePINNewPIN,
    navigationOptions : {
      header : null
    }
  },
  ChangePINInputPwd : {
    screen : ChangePINInputPwd,
    navigationOptions : {
      header : null
    }
  }
})

export default createAppContainer(SettingNavigator)