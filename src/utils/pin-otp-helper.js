import React, { useState } from 'react';
import { Text } from 'src/components/Text/CustomText';
import { Info, Button } from 'src/components/Button/Button';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

const openPin = (navigation, onResolve, { info, textTitle }) => {
	navigation.navigate('/input-code', {
		header: <Text align="center">{textTitle || 'Masukkan PIN anda saat ini'}</Text>,
		footer: <Info color={["settingBg", "settingFont"]}>{info || 'Untuk melanjutkan pembayaran, anda harus memasukkan PIN anda saat ini'}</Info>,
		secureTextEntry: true,
		title: 'PIN',
		value: '',
		onResolve
	})
}

const openOtp = ({ navigation, info, textTitle, ...obj }) => {
	navigation.navigate('/input-code', {
		header: <Text align="center">{textTitle || 'OTP telah dikirim ke nomor HP Anda'}</Text>,
		footer: <Info color={["settingBg", "settingFont"]}>{info}</Info>,
		isOtp: true,
		value: '',
		...obj
	})
}

export { openPin, openOtp }