import React, { useState } from 'react';
import { Modal } from 'src/components/ModalContent/Popups';
import { Text } from 'src/components/Text/CustomText';
import { View } from 'react-native';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import Container from 'src/components/View/Container';
import CodeInput from 'react-native-confirmation-code-input';

const GlobalEnterPin = props => {
	const { visible, visibleToggle, codeLength, pinResolve, title, subtitle } = props
	const [pinCode, setPinCode] = useState()
	const _nextBtn = () => {
		pinResolve(pinCode, _closePin)
	}
	const _closePin = () => {
		setPinCode()
		visibleToggle(false)
	}
	return <Modal visible={visible} style={{
		maxWidth: '100%', maxHeight: '100%',
		width: '100%',
		height: '100%',
		paddingVertical: 0
	}}>
		<Container style={{ alignItems: 'center' }} header={{
			title: 'PIN',
			onPressBack: () => _closePin()
		}}>
			<Text style={{ padding: 20 }}>{title ? title : 'Masukkan PIN'}</Text>
			<View style={{ paddingHorizontal: 15, height: 80, backgroundColor: 'white', marginHorizontal: 30, alignItems: "center" }}>
				<CodeInput
					secureTextEntry
					className='border-circle'
					keyboardType="numeric"
					activeColor='#cd0192'
					inactiveColor='#cd0192'
					codeLength={codeLength || 6}
					size={40}
					autoFocus
					onCodeChange
					onFulfill={(code) => setPinCode(code)}
				/>
			</View>
			<Text style={{ padding: 10 }} align="center">{subtitle ? subtitle : 'PIN dibutuhkan untuk mengubah password'}</Text>
			<Bottom>
				<Button width="100%" onPress={_nextBtn}>LANJUT</Button>
			</Bottom>
		</Container>
	</Modal>
}

export default GlobalEnterPin