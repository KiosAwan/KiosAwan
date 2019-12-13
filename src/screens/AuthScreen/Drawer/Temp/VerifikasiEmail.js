import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { Bottom, Button, ButtonPrimary } from '../../../../components/Button/ButtonComp';
import { ColorsList } from '../../../../styles/colors';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { WrapperItem } from '../../../../components/Picker/SelectBoxModal';
import { Icon } from 'native-base';


const VerifikasiEmail = ({ navigation }) => {
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Verifikasi Email" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15 }}>
				<View style={{ padding: 20, backgroundColor: ColorsList.whiteColor, marginBottom: 15 }}>
					<FloatingInput label="Email">
						<TextInput value="" />
					</FloatingInput>
				</View>
				<View style={{ padding: 20, backgroundColor: ColorsList.dangerSoft }}>
					<WrapperItem rightStyle={{ alignItems: 'flex-start', width: '85%' }} left={
						<Icon name="close-circle-outline" style={{ fontSize: 60, color: ColorsList.danger }} />
					} right={[
						<Text style={{ fontSize: 20, color: ColorsList.danger }}>Email anda belum terverifikasi!</Text>,
						<Text style={{ color: ColorsList.danger }}>Mohon segera verifikasi email anda</Text>
					]} />
				</View>
			</View>
			<Bottom>
				<Button color="white" style={{ width: '47.5%' }}>GANTI EMAIL</Button>
				<Button color="primary" style={{ width: '47.5%' }}>KIRIM ULANG</Button>
			</Bottom>
		</View>
	)
}

export default VerifikasiEmail

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})