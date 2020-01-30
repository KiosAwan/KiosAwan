import React, { useState } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { SizeList } from '../../../../styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { sendOTPAuth, resendVerifyEmail } from '../../../../utils/authhelper';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { AwanPopup } from 'src/components/ModalContent/Popups';
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
				<View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
					<FloatingInput label="Email Anda">
						<TextInput value={User.data.email}
							editable={false}
						/>
						<Image style={{ width: 30, height: 30 }} source={User.data.status == 0 ? require('../../../../assets/icons/rejectcheck.png') : require('../../../../assets/icons/successcheck.png')} />
					</FloatingInput>
				</View>
				{User.data.status == 0 ?
					<View style={{ backgroundColor: ColorsList.dangerSoft, marginTop: 30 }}>
						<Text style={{ textAlign: 'center', ...FontList.titleFont, color: ColorsList.danger, padding: 5 }}>Email anda belum terverifikasi, mohon segera verifikasi email Anda</Text>
					</View> :
					<View style={{ backgroundColor: ColorsList.successSoft, marginTop: 30 }}>
						<Text style={{ textAlign: 'center', ...FontList.titleFont, color: ColorsList.success, padding: 5 }}>Email anda telah terverifikasi, tekan tombol dibawah untuk mengganti</Text>
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
						<Button onPress={_nextBtn} color="white" width="100%">UBAH</Button>
				}
			</Bottom>
		</View>
	)
}

export default UbahEmailInfoScreen