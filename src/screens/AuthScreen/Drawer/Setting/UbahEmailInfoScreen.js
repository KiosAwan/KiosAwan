import React, { useState } from 'react';
import { View, TextInput, Image } from 'react-native';
import { SizeList } from 'src/styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { sendOTPAuth, resendVerifyEmail } from 'src/utils/authhelper';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Input } from 'src/components/Input/MDInput';
import { Toast } from 'native-base';
import { Text } from 'src/components/Text/CustomText';
const UbahEmailInfoScreen = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const [apiLoading, setApiLoading] = useState(false)

	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const _nextBtn = async () => {
		setApiLoading(true)
		const data = {
			phone_number: User.data.phone_number
		}
		const res = await sendOTPAuth(data)
		if (res.status == 400) {
			setApiLoading(false)
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		} else {
			setApiLoading(false)
			navigation.navigate('/drawer/settings/change-email/otp-validation')
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
				{/* <View style={{ padding: 20, width: SizeList.width - 40, backgroundColor: 'white', borderRadius: 5 }}> */}
				<Input label="Email" value={User.data.email}
					editable={false}
					renderRightAccessory={() =>
						<Image style={{ width: 30, height: 30 }} source={User.data.status == 0 ? require('src/assets/icons/rejectcheck.png') : require('src/assets/icons/successcheck.png')} />} />
				{/* </View> */}
				{User.data.status == 0 ?
					<View style={{ backgroundColor: ColorsList.dangerSoft, marginTop: SizeList.base, borderRadius : SizeList.borderRadius }}>
						<Text color="danger" style={{ padding: 10 }} >Email anda belum terverifikasi, mohon segera verifikasi email Anda</Text>
					</View> :
					<View style={{ backgroundColor: ColorsList.successSoft, marginTop: SizeList.base, borderRadius : SizeList.borderRadius }}>
						<Text style={{ padding: 10 }} color="success">Email anda telah terverifikasi, tekan tombol dibawah untuk mengganti</Text>
					</View>
				}
			</View>
			<Bottom>
				{
					User.data.status == 0 ?
						[
							<Button onPress={_handleSendEmail} color="white" width="47.5%">Kirim Ulang</Button>,
							<Button onPress={() => navigation.navigate('/drawer/settings/change-email/new-email')} width="47.5%">Ubah Email</Button>
						]
						:
						<Button onPress={_nextBtn} width="100%">UBAH</Button>
				}
			</Bottom>
		</View>
	)
}

export default UbahEmailInfoScreen