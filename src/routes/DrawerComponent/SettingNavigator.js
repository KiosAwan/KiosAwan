import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
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
import UbahPasswordInputPIN from '../../screens/AuthScreen/Drawer/Setting/UbahPasswordInputPIN';
import UbahEmailNewEmail from '../../screens/AuthScreen/Drawer/Setting/UbahEmailNewEmail'
import MenuSettingUbahNoHPInputOTP from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahNoHPInputOTP'

const SettingNavigator = createStackNavigator({
  '/drawer/settings': {
    screen: MenuSetting,
    navigationOptions: {
      header: null
    }
	},
	'/drawer/settings/profile': {
    screen: MenuSettingProfil,
    navigationOptions: {
      header: null
    }
	},
	'/drawer/settings/change-email': {
    screen: MenuSettingUbahEmail,
    navigationOptions: {
      header: null
    }
	},
  '/drawer/settings/change-email/new-email' : {
    screen : UbahEmailNewEmail,
    navigationOptions : {
      header : null
    }
  },
	'/drawer/settings/change-phone-number/change': {
    screen: MenuSettingUbahNoHP,
    navigationOptions: {
      header: null
    }
	},
	'/drawer/settings/change-phone-number': {
    screen: MenuSettingUbahNoHPInputOTP,
    navigationOptions: {
      header: null
    }
	},
  '/drawer/settings/change-password' : {
    screen : UbahPasswordInputPIN,
    navigationOptions : {
      header : null
    }
  },
	'/drawer/settings/change-password/change': {
    screen: MenuSettingUbahPassword,
    navigationOptions: {
      header: null
    }
	},
	'/drawer/settings/lupa-pin': {
    screen: MenuSettingLupaPIN,
    navigationOptions: {
      header: null
    }
  },
  '/drawer/settings/forgot-pin' : {
    screen : ForgotPINOTP,
    navigationOptions : {
      header : null
    }
  },
  '/drawer/settings/forgot-pin/new-pin' : {
    screen : ForgotPINNewPIN,
    navigationOptions : {
      header : null
    }
  },
  '/drawer/settings/change-pin' : {
    screen : ChangePINInputPwd,
    navigationOptions : {
      header : null
    }
  },
  '/drawer/settings/change-pin/new-pin' : {
    screen : ChangePINNewPIN,
    navigationOptions : {
      header : null
    }
  },
})

export default createAppContainer(SettingNavigator)