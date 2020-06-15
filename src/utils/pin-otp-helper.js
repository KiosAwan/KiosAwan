import React from 'react';
import { Text } from 'src/components/Text/CustomText';
import { Info } from 'src/components/Button/Button';

const openPin = (navigation, onResolve) => {
	navigation.navigate('/input-code', {
		header: <Text align="center">Masukkan PIN anda</Text>,
		footer: <Info color={["settingBg", "settingFont"]}>Untuk melanjutkan pembayaran, anda harus memasukkan PIN anda saat ini</Info>,
		secureTextEntry: true,
		title: 'PIN',
		value: '',
		onResolve
	})
}

export { openPin }