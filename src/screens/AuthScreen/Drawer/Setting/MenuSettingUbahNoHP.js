import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { Button } from 'native-base';

const MenuSettingUbahNoHP = ({ navigation }) => {
	const [otpCode, setOtpCode] = useState(navigation.params ? navigation.params.OTP : undefined)
	const [modalVisible, setModalVisible] = useState(false)

	const _nextBtn = () => {
		setModalVisible(true)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('../../../../assets/images/createpinsuccess.png')}
					infoText="Anda Berhasil Mengubah No HP!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<GlobalHeader title="Ubah No. HP" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15, backgroundColor: 'white', margin: 30 }}>
				<View>
					<FloatingInput label="Masukkan nomor baru anda">
						<TextInput value="" />
					</FloatingInput>
				</View>
				<View>
					<FloatingInput style={{ marginTop: 30 }} label="Masukkan nomor baru anda">
						<TextInput value="" />
					</FloatingInput>
				</View>
			</View>

			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_nextBtn}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="SIMPAN"
				/>
			</View>
		</View>
	)
}

export default MenuSettingUbahNoHP;