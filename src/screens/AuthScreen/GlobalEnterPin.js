import React, { useState } from "react"
import { Modal } from "src/components/ModalContent/Popups"
import { Text } from "src/components/Text/CustomText"
import { View } from "react-native"
import { Bottom } from "src/components/View/Bottom"
import { Button } from "src/components/Button/Button"
import Container from "src/components/View/Container"
import CodeInput from "react-native-confirmation-code-input"
import PinView from "src/components/Input/PinView"
import LinearGradient from "react-native-linear-gradient"
import { ColorsList } from "src/styles/colors"

const GlobalEnterPin = props => {
	const {
		visible,
		visibleToggle,
		codeLength,
		pinResolve,
		title,
		subtitle,
	} = props
	const [pinCode, setPinCode] = useState()
	const _nextBtn = () => {
		pinResolve(pinCode, _closePin)
	}
	const _closePin = () => {
		setPinCode()
		visibleToggle(false)
	}
	return (
		<Modal
			onRequestClose={_closePin}
			visible={visible}
			style={{
				maxWidth: "100%",
				maxHeight: "100%",
				width: "100%",
				height: "100%",
				paddingVertical: 0,
			}}>
			<View
				style={{
					flex: 1,
					justifyContent: "space-between",
					backgroundColor: ColorsList.authBackground,
				}}>
				<PinView
					title={
						<View style={{ width: "60%", alignItems: "center" }}>
							<Text style={{ marginBottom: 10 }} size={16}>
								Silahkan masukkan PIN Anda
							</Text>
							<Text align="center" size={12}>
								Proses pemotongan saldo akan dilakukan setelah memasukkan PIN
							</Text>
						</View>
					}
					onPressBack={_closePin}
					pinLength={codeLength || 4}
					onComplete={(code, clear) =>
						pinResolve(code, () => {
							clear()
							_closePin()
						})
					}
				/>
			</View>
		</Modal>
	)
}

export default GlobalEnterPin
