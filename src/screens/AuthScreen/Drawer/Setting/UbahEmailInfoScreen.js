import React, { useState } from 'react';
import { View, TextInput, Image } from 'react-native';
import { SizeList } from 'src/styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { sendOTPAuth, resendVerifyEmail, verifyOTPAuth } from 'src/utils/authhelper';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Input } from 'src/components/Input/MDInput';
import { Toast } from 'native-base';
import { Text } from 'src/components/Text/CustomText';
import { openOtp } from 'src/utils/pin-otp-helper';
import { showPhoneNumber } from 'src/utils/unauthhelper';
const UbahEmailInfoScreen = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const [apiLoading, setApiLoading] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const _nextBtn = async () => {
		_sendCode()
		openOtp({
			navigation,
			title: 'Ubah Email',
			textTitle: `OTP telah di kirim ke nomor +${showPhoneNumber(User.data.phone_number)}`,
			info: "Untuk mengubah email, anda harus memasukkan kode OTP yang telah dikirim ke nomor HP anda",
			resend: _sendCode,
			onResolve: async otp => {
				const data = { phone_number: User.data.phone_number, otp }
				const res = await verifyOTPAuth(data)
				if (res.status == 400) {
					setAlertMessage(res.data.errors.msg)
					setAlert(true)
				} else if (res.status == 200) {
					navigation.navigate('/drawer/settings/change-email/new-email')
				}
			}
		})
	}

	const _sendCode = async () => {
		setApiLoading(true)
		const data = {
			phone_number: User.data.phone_number
		}
		const res = await sendOTPAuth(data)
		setApiLoading(false)
		if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}

	const _handleSendEmail = async () => {
		setApiLoading(true)
		const data = {
			email: User.data.email
		}
		const res = await resendVerifyEmail(data)
		setApiLoading(false)
		if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		} else if (res.status == 200) {
			Toast.show({
				type: "success",
				text: "Email berhasil dikirim"
			})
		}
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={apiLoading} />
			<GlobalHeader title="Ubah Email" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 20 }}>
				<Input label="Email" value={User.data.email}
					editable={false}
					renderRightAccessory={() =>
						<Image style={{ width: 20, height: 20 }} source={User.data.status == 0 ? require('src/assets/icons/rejectcheck.png') : require('src/assets/icons/successcheck.png')} />} />
				{User.data.status == 0 ?
					<View style={{ backgroundColor: ColorsList.settingBg, marginTop: SizeList.base, borderRadius: SizeList.borderRadius }}>
						<Text color="settingFont" style={{ padding: 10 }} >Email anda belum terverifikasi, mohon segera verifikasi email Anda</Text>
					</View> :
					<View style={{ backgroundColor: ColorsList.settingBg, marginTop: SizeList.base, borderRadius: SizeList.borderRadius }}>
						<Text style={{ padding: 10 }} color="settingFont">Email anda telah terverifikasi, tekan tombol dibawah untuk mengganti</Text>
					</View>
				}
			</View>
			<Bottom>
				{
					User.data.status == 0 ?
						[
							<Button onPress={_handleSendEmail} color="link" width="47.5%">KIRIM ULANG</Button>,
							<Button onPress={() => navigation.navigate('/drawer/settings/change-email/new-email')} width="47.5%">UBAH</Button>
						]
						:
						<Button onPress={_nextBtn} width="100%">UBAH</Button>
				}
			</Bottom>
		</View>
	)
}

export default UbahEmailInfoScreen