import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import RBSheet from "react-native-raw-bottom-sheet";
import { getUniqueId } from 'react-native-device-info';

// Styling 
import {
	View,
	StyleSheet,
	Dimensions,
	Image,
	TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own custom components
import { InputNumber } from '../../components/Input/InputComp'
import VerifyOTPRegister from './OTPVerification';

//Redux Actions
import { addPhoneNumber, addDeviceId, addVerifyOTP } from '../../redux/actions/actionsRegistration'

//Functions
import Strings from '../../utils/Strings'
import { sendPhoneNumber, phoneValidation, sendOTP, sendVerifyOTP } from 'src/utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { HeaderRegister } from '../../components/Header/Header';
import { FontList } from 'src/styles/typography';
import { AwanPopup, Modal } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';
import { Bottom } from 'src/components/View/Bottom';
import { ColorsList } from 'src/styles/colors';
import Container from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Border, $Padding } from 'src/utils/stylehelper';
import PinView from 'src/components/Input/PinView';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PhoneRegistration = ({ navigation }) => {
	const FormRegister = useSelector(state => state.Registration)
	const dispatch = useDispatch()
	let OTPRegisterSheet
	const [btnDisabled, setBtnDisabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const [popup, setPopup] = useState(false)
	const [viewTerm, setViewTerm] = useState(true)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState()
	useEffect(() => {
		_getDeviceInfo()
		// OTPRegisterSheet.open()
	}, [])

	const _getDeviceInfo = async () => {
		let uniqueId = getUniqueId();
		await dispatch(addDeviceId(uniqueId))
	}
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

	const _sendOTP = async (otpsheet) => {
		setPopup(false)
		setLoading(true)
		const data = {
			phone_number: "62" + FormRegister.phone_number,
		}
		const res = await sendOTP(data)
		setLoading(false)
		if (res.status == 200) {
			navigation.navigate('/unauth/registration/otp', {
				FormRegister, _resendOTP, _navigateRegister,
				otpFulfilled: code => _handleOTPFulfilled(OTPRegisterSheet, code)
			})
			// await otpsheet.open()
		} else {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
	}

	const _resendOTP = async () => {
		setLoading(true)
		// setPopup(false)
		const data = {
			phone_number: "62" + FormRegister.phone_number,
		}
		const res = await sendOTP(data)
		setLoading(false)
		if (res.status == 200) {
			// await otpsheet.open()
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

	//Sending OTP code to server
	const _handleOTPFulfilled = async (otpsheet, code) => {
		await dispatch(addVerifyOTP(code))
		const data = {
			phone_number: "62" + FormRegister.phone_number,
			otp: code
		}
		const res = await sendVerifyOTP(data)
		console.debug(res)
		if (res.status == 200) {
			_navigateRegister()
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
	return <Container style={{ padding: 15, flex: 1 }}>
		<RBSheet
			ref={ref => {
				OTPRegisterSheet = ref;
			}}
			height={height * 2 / 6}
			closeOnPressMask={false}
			closeOnDragDown={false}
			duration={250}
			animationType="slide"
			customStyles={{
				container: {
					borderTopLeftRadius: 10,
					borderTopRightRadius: 10
				},
			}}
		>
			<View>
				<VerifyOTPRegister navigateTo={_navigateRegister} closeSheet={() => OTPRegisterSheet.close()}
					openSheet={() => OTPRegisterSheet.open()}
					otpFulfilled={(code) => _handleOTPFulfilled(OTPRegisterSheet, code)}
					alert={(data) => {
						setAlertMessage(data)
						setAlert(true)
					}}
					sendOTP={_resendOTP}
				/>
			</View>
		</RBSheet>
		<AwanPopup.Alert
			message={alertMessage}
			visible={alert}
			closeAlert={() => setAlert(false)}
		/>
		<AwanPopup.Loading visible={loading} />
		<Modal visible={popup} style={{ borderRadius: 5, width: '80%', ...$Padding(20, 15) }}>
			<Text style={{ marginBottom: 10, padding: 10, backgroundColor: ColorsList.white, elevation: 2 }} size={20} align="center">0 {FormRegister.phone_number.split('').join(' ')}</Text>
			<Text color="pink">Nomor ini tidak ditemukan.</Text>
			<Text>Apakah Anda yakin akan mendaftar aplikasi menggunakan nomor ini?</Text>
			<Wrapper style={{ marginTop: 15 }} flexContent>
				<Button onPress={() => setPopup(false)} color="link">Batal</Button>
				<Button radius={50} onPress={() => _sendOTP(OTPRegisterSheet)}>LANJUT</Button>
			</Wrapper>
		</Modal>
		<View style={{ justifyContent: 'center', marginBottom: 10, flex: 1 }}>
			<Image
				style={{ width: 170, height: 100, alignSelf: "center" }}
				source={require('src/assets/images/logo.png')}
			/>
			<Text align="center">{Strings.REGISTERPHONESUBTITLE}</Text>
			<Wrapper flexStart style={{ marginVertical: 10, alignSelf: 'center', width: '80%' }}>
				<Text style={{ elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}>+62</Text>
				<TextInput
					_flex
					keyboardType="number-pad"
					value={FormRegister.phone_number}
					onChangeText={phone => _handleChangePhone(phone)}
					style={{ color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 10, backgroundColor: ColorsList.authBackground }}
				/>
			</Wrapper>
			<Text align="center" style={{ color: ColorsList.pink }}>
				{
					__DEV__ ?
						<Text size={13} onPress={() => _handleChangePhone('82134156961')}>{Strings.REGISTERTERM1}</Text>
						:
						Strings.REGISTERTERM1
				}
				<Text color="pink" size={13} onPress={() => navigation.navigate('/unauth/registration/term-condition')}>{Strings.REGISTERTERM2}</Text>
			</Text>
		</View>
		<Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleSendPhoneNumber}>LANJUT</Button>
	</Container>
	return (
		<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={styles.container} >
			<BarStatus />
			{/* {Bottom sheet for verify OTP new user} */}
			<RBSheet
				ref={ref => {
					OTPRegisterSheet = ref;
				}}
				height={height * 2 / 7}
				closeOnPressMask={false}
				closeOnDragDown={false}
				duration={250}
				animationType="slide"
				customStyles={{
					container: {
						borderTopLeftRadius: 10,
						borderTopRightRadius: 10
					},
				}}
			>
				<View>
					<VerifyOTPRegister navigateTo={_navigateRegister} closeSheet={() => OTPRegisterSheet.close()}
						openSheet={() => OTPRegisterSheet.open()}
						otpFulfilled={(code) => _handleOTPFulfilled(OTPRegisterSheet, code)}
						alert={(data) => {
							setAlertMessage(data)
							setAlert(true)
						}}
						sendOTP={_resendOTP}
					/>
				</View>
			</RBSheet>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={loading} />
			<AwanPopup.Title visible={popup} title={<Text aaa align="center" color="primary" size={20}>+62 {FormRegister.phone_number + '\n'}</Text>} message={<Text aaa font="Italic">
				<Text aaa font="ExtraBold">Nomor ini belum terdaftar, </Text>
				apakah anda yakin ingin menggunakan nomor ini?
            </Text>}>
				<Button onPress={() => setPopup(false)} width="40%" color="link">Tidak</Button>
				<Button onPress={() => _sendOTP(OTPRegisterSheet)} width="40%">Ya</Button>
			</AwanPopup.Title>
			<View style={{ flex: 1 }}>
				<View style={{ alignItems: "center", padding: 20 }}>
					<View style={styles.wrapHeader}>
						<HeaderRegister />
					</View>
					<Text style={styles.subtitleEnterPhone}>
						{
							__DEV__ ?
								<Text color="whiteColor" onPress={() => _handleChangePhone('85717570370')}>{Strings.REGISTERPHONESUBTITLE}</Text>
								:
								Strings.REGISTERPHONESUBTITLE
						}
					</Text>
				</View>
				<View style={styles.inputView}>
					<InputNumber
						inputWidth={width * 3 / 5}
						value={FormRegister.phone_number}
						handleChangeText={(phone) => _handleChangePhone(phone)}
						inputProps={{
							onBlur: () => setViewTerm(true),
							onFocus: () => setViewTerm(false),
							autoFocus: false
						}}
					/>
					{viewTerm ?
						<View style={styles.termAndCond}>
							<Text align="center" style={{ color: ColorsList.pink }}>
								{
									__DEV__ ?
										<Text size={13} color="pink" onPress={() => _handleChangePhone('82134156961')}>{Strings.REGISTERTERM1}</Text>
										:
										Strings.REGISTERTERM1
								}
								<Text color="white" size={13} onPress={() => navigation.navigate('/unauth/registration/term-condition')}>{Strings.REGISTERTERM2}</Text>
							</Text>
						</View> : null
					}
				</View>
			</View>
			<Bottom>
				<Button width="100%" color={btnDisabled ? 'transparent' : 'transparentWhite'} styless={{ backgroundColor: ColorsList.transparent }} disabled={btnDisabled} onPress={_handleSendPhoneNumber}>LANJUT</Button>
			</Bottom>
		</LinearGradient>
	)
}


export default PhoneRegistration

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	inputView: {
		alignItems: "center",
		justifyContent: "center",
	},
	validNotif: {
		textAlign: 'center',
		padding: 10,
		color: "red"
	},
	rowChild: {
		flexDirection: "row",
		alignItems: "center",
		width: '80%',
		justifyContent: "center"
	},
	subtitleEnterPhone: {
		...FontList.titleFont,
		paddingTop: 10,
		paddingHorizontal: 20,
		color: 'white',
		textAlign: "center"
	},
	logoStyle: {
		height: 80,
		width: 150
	},
	termAndCond: {
		width: '80%',
		paddingTop: 30
	},
	wrapHeader: {
		flexDirection: 'row',
		justifyContent: "center",
		alignItems: "flex-end",
	}
})
