import React, { useState } from "react"
import { View, Image, Modal } from "react-native"
import { SizeList } from "src/styles/size"
import { useSelector } from "react-redux"
import { ColorsList } from "src/styles/colors"
import { sendOTPAuth, verifyOTPAuth, createUserPIN } from "src/utils/authhelper"
import { showPhoneNumber } from "src/utils/unauthhelper"
import { AwanPopup } from "src/components/ModalContent/Popups"
import Container, { Footer, Body } from "src/components/View/Container"
import { Button } from "src/components/Button/Button"
import { Input } from "src/components/Input/MDInput"
import { Text } from "src/components/Text/CustomText"
import { openOtp, openPin } from "src/utils/pin-otp-helper"
import { stateObject } from "src/utils/state"
import Storage from "src/utils/keyStores"
import ModalContent from "src/components/ModalContent/ModalContent"
const MenuSettingLupaPIN = ({ navigation }) => {
	const User = useSelector(state => state.User)
	//alert
	const [alert, setAlert] = stateObject({
		visible: false,
		modal: false,
		loading: false,
	})

	const sendOtp = async () => {
		setAlert({ loading: true })
		const data = {
			phone_number: User.data.phone_number,
		}
		const res = await sendOTPAuth(data)
		setAlert({ loading: false })
		if (res.status == 400) {
			setAlert({ visible: true, message: res.data.errors.msg })
		}
		return res
	}

	const _handleSavePIN = async (pin, confirmPin) => {
		if (!pin || !confirmPin) {
			setAlert({ message: "Pin harus 4 digit", visible: true })
		} else if (pin != confirmPin) {
			setAlert({ message: "Pin harus sama", visible: true })
		} else {
			setAlert({ loading: true })
			const id = await Storage.getItem("userId")
			const data = { id, pin }
			await createUserPIN(data)
			setAlert({ loading: false })
			setAlert({ modal: true })
			setTimeout(() => {
				setAlert({ modal: false })
				navigation.navigate("/")
			}, 2000)
		}
	}

	const openNewPin1 = async () => {
		openPin({
			navigation: navigation.push,
			title: "Lupa PIN",
			textTitle: "Masukkan PIN baru anda",
			footer: null,
			onResolve: async pin => {
				await Storage.setItem("lupaPin_pin", pin)
				openNewPin2()
			},
		})
	}

	const openNewPin2 = () => {
		openPin({
			navigation: navigation.push,
			title: "Lupa PIN",
			textTitle: "Ulangi masukkan PIN baru anda",
			footer: null,
			onResolve: async confirm => {
				const newPin = await Storage.getItem("lupaPin_pin")
				if (newPin == confirm) {
					_handleSavePIN(newPin, confirm)
				}
			},
		})
	}

	const openInputOtp = () => {
		openOtp({
			navigation,
			title: "Lupa PIN",
			textTitle: `OTP telah di kirim ke nomor +${showPhoneNumber(
				User.data.phone_number,
			)}`,
			info:
				"Untuk membuat PIN, anda harus memasukkan kode OTP yang telah dikirim ke nomor HP anda",
			resend: sendOtp,
			onResolve: async otp => {
				const data = { phone_number: User.data.phone_number, otp }
				const res = await verifyOTPAuth(data)
				if (res.status == 400) {
					setAlert({ visible: true, message: res.data.errors.msg })
				} else if (res.status == 200) {
					openNewPin1()
				}
			},
		})
	}

	const _nextBtn = async () => {
		const { status } = await sendOtp()
		if (status != 400) {
			openInputOtp()
		}
	}

	return (
		<Container
			header={{
				title: "Lupa PIN",
				onPressBack: () => navigation.goBack(),
			}}>
			<AwanPopup.Alert
				message={alert.message}
				visible={alert.visible}
				closeAlert={() => setAlert({ visible: false })}
			/>
			<Modal
				transparent={true}
				onRequestClose={() => {
					setAlert({ modal: !alert.modal })
				}}
				visible={alert.modal}
				animationType="fade">
				<ModalContent
					image={require("src/assets/images/createpinsuccess.png")}
					infoText="Anda Berhasil Membuat PIN Baru!"
					closeModal={() => setAlert({ modal: false })}
				/>
			</Modal>
			<AwanPopup.Loading visible={alert.loading} />
			<Body>
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
						Anda akan dikirimkan OTP melalui SMS ke nomor berikut{" "}
					</Text>
				</View>
			</Body>
			<Footer>
				<Button onPress={_nextBtn}>LANJUT</Button>
			</Footer>
		</Container>
	)
}

export default MenuSettingLupaPIN
