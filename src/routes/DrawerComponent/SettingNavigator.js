import MenuSetting from '../../screens/AuthScreen/Drawer/Setting/MenuSetting'
import MenuSettingProfil from '../../screens/AuthScreen/Drawer/Setting/MenuSettingProfil'
import MenuSettingUbahNoHP from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahNoHP'
import MenuSettingUbahPassword from '../../screens/AuthScreen/Drawer/Setting/MenuSettingUbahPassword'
import MenuSettingLupaPIN from '../../screens/AuthScreen/Drawer/Setting/MenuSettingLupaPIN'
import ForgotPINNewPIN from '../../screens/AuthScreen/Drawer/Setting/ForgotPINNewPIN'
import ForgotPINOTP from '../../screens/AuthScreen/Drawer/Setting/ForgotPINOTP'
import ChangePINNewPIN from '../../screens/AuthScreen/Drawer/Setting/ChangePINNewPIN';
import ChangePINInputPwd from '../../screens/AuthScreen/Drawer/Setting/ChangePINInputPwd';
import UbahEmailNewEmail from '../../screens/AuthScreen/Drawer/Setting/UbahEmailNewEmail'
import UbahNoHPInfoScreen from '../../screens/AuthScreen/Drawer/Setting/UbahNoHPInfoScreen'
import PengaturanPerangkat from 'src/screens/AuthScreen/Drawer/Setting/PengaturanPerangkat'
import TambahPerangkat from 'src/screens/AuthScreen/Drawer/Setting/TambahPerangkat'

const SettingNavigator = {
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
    screen: UbahNoHPInfoScreen,
    navigationOptions: {
      header: null
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
  '/drawer/settings/perangkat' : {
    screen : PengaturanPerangkat,
    navigationOptions : {
      header : null
    }
  },
  '/drawer/settings/perangkat/tambah' : {
    screen : TambahPerangkat,
    navigationOptions : {
      header : null
    }
  },
}

export default SettingNavigator