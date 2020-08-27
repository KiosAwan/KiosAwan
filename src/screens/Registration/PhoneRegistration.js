import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { View } from 'react-native';
import { addPhoneNumber } from 'src/redux/actions/actionsRegistration'
import Strings from 'src/utils/Strings'
import { sendPhoneNumber, phoneValidation, sendOTP, sendVerifyOTP, showPhoneNumber } from 'src/utils/unauthhelper';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import Container from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Padding } from 'src/utils/stylehelper';
import UnauthHeader from 'src/components/View/UnauthHeader';
import { Input } from 'src/components/Input/MDInput';
import Divider from 'src/components/Row/Divider';
import { SizeList } from 'src/styles/size';
import { openOtp } from 'src/utils/pin-otp-helper';
import { APP_VERSION } from 'src/config/constant';

const PhoneRegistration = ({ navigation }) => {
	const FormRegister = useSelector(state => state.Registration)
	const dispatch = useDispatch()
	const [btnDisabled, setBtnDisabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const [popup, setPopup] = useState(false)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()

	//Function handle change input and add to reducer
	const _handleChangePhone = (number) => {
		if (number[0] != 0) {
			const checkNumber = phoneValidation("62" + number)
			if (checkNumber) {
				setBtnDisabled(false)
			} else {
				setBtnDisabled(true)
			}
			dispatch(addPhoneNumber(number))
		}
	}

	const _handleLanjutButton = async () => {
		setPopup(false)
		_sendOTP()
		openOtp({
			navigation,
			title: '',
			textTitle: `OTP telah di kirim ke nomor +${showPhoneNumber(`62${FormRegister.phone_number}`)}`,
			info: "Anda harus memasukkan kode OTP yang telah dikirim ke nomor HP anda",
			resend: _sendOTP,
			onResolve: async otp => {
				setLoading(true)
				const data = {
					phone_number: "62" + FormRegister.phone_number,
					otp
				}
				const res = await sendVerifyOTP(data)
				setLoading(false)
				if (res.status == 400) {
					setAlertMessage(res.data.errors.msg)
					setAlert(true)
				} else if (res.status == 200) {
					_navigateRegister()
				}
			}
		})
	}
	const _sendOTP = async () => {
		setLoading(true)
		const data = {
			phone_number: "62" + FormRegister.phone_number,
		}
		const res = await sendOTP(data)
		setLoading(false)
		if (res.status == 200) {
			console.debug("Success resend")
		} else {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}
	// Function handle press Next button
	const _handleSendPhoneNumber = async () => {
		setLoading(true)
		setPopup(false)
		const data = {
			phone_number: "62" + FormRegister.phone_number,
			app_version: APP_VERSION
		}
		const res = await sendPhoneNumber(data)
		setLoading(false)
		if (res.type == "login") {
			navigation.navigate('/unauth/login')
		} else if (res.type == "register") {
			setPopup(true)
		} else {
			if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			}
		}
	}
	const _navigateRegister = () => {
		navigation.navigate('/unauth/registration')
	}
	return <Container style={{ padding: SizeList.bodyPadding, flex: 1 }}>
		<AwanPopup.Alert
			message={alertMessage}
			visible={alert}
			closeAlert={() => setAlert(false)}
		/>
		<AwanPopup.Loading visible={loading} />
		<Modal visible={popup} style={{ borderRadius: 5, width: '80%', ...$Padding(20, 20) }}>
			<Text
				style={{
					marginBottom: 10,
					padding: 10,
					backgroundColor: ColorsList.white,
					borderRadius: SizeList.borderRadius,
					borderWidth: SizeList.borderWidth,
					borderColor: ColorsList.borderColor
				}}
				size={20}
				align="center"
			>0 {FormRegister.phone_number.split('').join(' ')}</Text>
			<Text style={{ marginBottom: 10, }} color="pink">Nomor ini tidak ditemukan.</Text>
			<Text style={{ marginBottom: 10, }}>Apakah Anda yakin akan mendaftar aplikasi menggunakan nomor ini?</Text>
			<Wrapper style={{ marginTop: 15 }} flexContent>
				<Button onPress={() => setPopup(false)} color="link">BATAL</Button>
				<Button radius={50} onPress={() => _handleLanjutButton()}>LANJUT</Button>
			</Wrapper>
		</Modal>
		<View style={{ justifyContent: 'center', marginBottom: 10, flex: 1 }}>
			<UnauthHeader />
			<Text align="center">{Strings.REGISTERPHONESUBTITLE}</Text>
			<Wrapper flexStart style={{ marginVertical: 10, alignSelf: 'center' }}>
				<Input disabled noLabel style={{ width: SizeList.base * 5 }} value="+62" />
				<Divider transparent size={5} />
				<Input
					_flex
					noLabel
					autoFocus
					placeholder="8xxxxxxxxxx"
					keyboardType="number-pad"
					value={FormRegister.phone_number}
					onChangeText={phone => _handleChangePhone(phone)}
				/>
			</Wrapper>
			{
				__DEV__ && <Text onPress={() => _handleChangePhone('81213141570')}>081213141570</Text>
			}
			{
				__DEV__ && <Text onPress={() => _handleChangePhone('85717570370')}>085717570370</Text>
			}
			<Text align="center">
				{
					__DEV__ ?
						<Text onPress={() => _handleChangePhone('82134156961')}>{Strings.REGISTERTERM1}</Text>
						:
						Strings.REGISTERTERM1
				}
				<Text color="pink" onPress={() => navigation.navigate('/unauth/registration/term-condition')}>{Strings.REGISTERTERM2}</Text>
			</Text>
		</View>
		<Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleSendPhoneNumber}>LANJUT</Button>
	</Container>

}


export default PhoneRegistration


