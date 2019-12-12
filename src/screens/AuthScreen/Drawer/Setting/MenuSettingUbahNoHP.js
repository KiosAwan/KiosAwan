import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ScrollView } from 'react-native-gesture-handler';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';


const MenuSettingUbahNoHP = ({ navigation }) => {
	const [otpCode, setOtpCode] = useState()
	const _handlePressBack = () => {
		alert(8)
	}
	const _handlePressNext = () => {
		alert(8)
	}
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Update Profil" onPressBack={_handlePressBack} />
			<ScrollView showsVerticalScrollIndicator={false} style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					<CodeInput
						keyboardType="numeric"
						activeColor='black'
						inactiveColor='grey'
						codeLength={6}
						size={40}
						autoFocus
						onFulfill={code => setOtpCode(code)}
					/>
				</View>
			</ScrollView>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10 }}>
				<BottomButton
					onPressBtn={_handlePressNext}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="SIMPAN"
				/>
			</View>
		</View>
	)
}

export default MenuSettingUbahNoHP
