import React from 'react';
import VerifyOTPRegister from './OTPVerification';
import { Image } from 'react-native';
import Container from 'src/components/View/Container';

const OTPInput = ({ navigation }) => {
	const { FormRegister, _navigateRegister, otpFulfilled, _resendOTP } = navigation.state.params
	return <Container style={{ justifyContent: 'center', padding: 15, flex: 1 }}>
		<Image
			style={{ width: 170, height: 100, alignSelf: "center" }}
			source={require('src/assets/images/logo.png')}
		/>
		<VerifyOTPRegister navigateTo={_navigateRegister}
			otpFulfilled={code => otpFulfilled(code)}
			sendOTP={_resendOTP}
		/>
	</Container>
}

export default OTPInput