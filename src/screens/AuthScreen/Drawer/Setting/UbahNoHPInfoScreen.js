import React, { useState } from "react"
import { View, Image } from "react-native"
import { SizeList } from "src/styles/size"
import { useSelector } from "react-redux"
import { GlobalHeader } from "src/components/Header/Header"
import { ColorsList } from "src/styles/colors"
import { FontList } from "src/styles/typography"
import { BottomButton } from "src/components/Button/ButtonComp"
import { sendCodeToEmail, verifyEmailCode } from "src/utils/authhelper"
import { showPhoneNumber } from "src/utils/unauthhelper"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { Input } from "src/components/Input/MDInput"
import { Text } from "src/components/Text/CustomText"
import { Bottom } from "src/components/View/Bottom"
import { Button } from "src/components/Button/Button"
import { openOtp } from "src/utils/pin-otp-helper"
const UbahNoHPInfoScreen = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const [apiLoading, setApiLoading] = useState(false)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const _nextBtn = async () => {
		await _sendCode()
		openOtp({
			navigation,
			title: "Ubah No. Hp",
			codeLength: 6,
			textTitle: `OTP telah di kirim ke email anda`,
			info:
				"Untuk mengubah No. Hp, anda harus memasukkan kode yang telah dikirim ke email anda",
			resend: _sendCode,
			onResolve: async otp => {
				const data = {
					email: User.data.email,
					code: otp,
				}
				const res = await verifyEmailCode(data)
				if (res.status == 400) {
					setAlertMessage(res.data.errors.msg)
					setAlert(true)
				} else if (res.status == 200) {
					navigation.navigate("/drawer/settings/change-phone-number/change")
				}
			},
		})
	}

	const _sendCode = async () => {
		setApiLoading(true)
		const data = {
			email: User.data.email,
		}
		const res = await sendCodeToEmail(data)
		if (res.status == 200) {
		} else if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		}
		setApiLoading(false)
		return res.status
	}

	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<AwanPopup.Loading visible={apiLoading} />
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<GlobalHeader
				title="Ubah No. HP"
				onPressBack={() => navigation.goBack()}
			/>
			<View style={{ padding: 20 }}>
				<Input
					label="No.HP"
					value={`62-${showPhoneNumber(
						User.data.phone_number.slice(2, User.data.length),
					)}`}
					editable={false}
					renderRightAccessory={() => (
						<Image
							style={{ width: 30, height: 30 }}
							source={
								User.data.status == 0
									? require("src/assets/icons/rejectcheck.png")
									: require("src/assets/icons/successcheck.png")
							}
						/>
					)}
				/>
				<View
					style={{
						backgroundColor: ColorsList.settingBg,
						marginTop: SizeList.base,
						borderRadius: SizeList.borderRadius,
					}}>
					<Text style={{ padding: 10 }} color="settingFont">
						Nomor anda sudah terverifikasi, tekan tombol dibawah untuk mengganti
					</Text>
				</View>
			</View>
			<Bottom>
				<Button onPress={_nextBtn} width="100%">
					UBAH
				</Button>
			</Bottom>
		</View>
	)
}

export default UbahNoHPInfoScreen
