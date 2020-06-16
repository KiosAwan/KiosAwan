import React, { useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'
import { Text } from 'src/components/Text/CustomText'
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import Container, { Body } from 'src/components/View/Container';
import { stylesglobe } from 'src/styles/globalStyle';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';
import { openPin } from 'src/utils/pin-otp-helper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { verifyUserPIN } from 'src/utils/authhelper';
const Akun = ({ navigation }) => {
	const User = useSelector(state => state.User)
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)
	const _onPressLogout = async (props) => {
		try {
			await AsyncStorage.removeItem('userId')
			navigation.navigate('/unauth')
		}
		catch (e) {
			alert(e)
		};

	}
	const AkunButton = (props) => {
		return <Button
			onPress={() => {
				if (props.name == "Keluar") {
					_onPressLogout()
				}
				else if (props.name == "Ubah password") {
					openPIN()
				}
				else {
					["Helpdesk", "FAQ"].includes(props.name) ? navigation.navigate(props.route) : User.store && User.data.status == 1 ? navigation.navigate(props.route) : null
				}
			}}
			width="100%"
			wrapper={{ justify: 'flex-start' }}
			color={['whiteColor', 'greyFont']}>
			<Wrapper width="100%" justify="space-between">
				<Text>{props.name}</Text>
			</Wrapper>
		</Button>
	}

	const openPIN = async () => {
		openPin({
			navigation: navigation.push,
			title: "Ubah Password",
			textTitle: "Masukkan PIN anda saat ini",
			footer: null,
			onResolve: async pin => {
				_nextBtn(pin)
			}
		})
	}

	const _nextBtn = async pinCode => {
		if (!pinCode) {
			setAlertMessage("PIN tidak boleh kosong")
			setAlert(true)
		} else {
			const data = {
				pin: pinCode,
				phone_number: User.data.phone_number
			}
			const res = await verifyUserPIN(data)
			if (res.status == 200) {
				navigation.navigate('/drawer/settings/change-password/change')
			}
			else if (res.status == 400) {
				setAlertMessage(res.data.errors.msg)
				setAlert(true)
			}
		}
	}
	return (
		<Container>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<Text style={{ marginTop: 15 }} font="SemiBold" align="center">AKUN</Text>
			<Body>
				<Wrapper style={{ marginBottom: 10 }} justify="space-between">
					<View>
						<Text font="SemiBold" >{User.data.name.toUpperCase()}</Text>
						<Text size={12}>{User.data.reff_code}</Text>
					</View>
					<Button disabled width={110} padding={5}>FREE USER</Button>
				</Wrapper>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Data pribadi"
						route="/drawer/settings/profile"
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Ubah email"
						route="/drawer/settings/change-email"
					/>
					<Divider />
					<AkunButton
						name="Ubah No. Hp"
						route="/drawer/settings/change-phone-number"
					/>
					<Divider />
					<AkunButton
						name="Ubah password"
						route="/drawer/settings/change-password"
					/>
					<Divider />
					<AkunButton
						name="Ubah PIN"
						route="/drawer/settings/change-pin"
					/>
					<Divider />
					<AkunButton
						name="Lupa PIN"
						route="/drawer/settings/lupa-pin"
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Hubungkan perangkat"
						route="/drawer/settings/perangkat"
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="FAQs"
						route="/drawer/faq"
					/>
					<Divider />
					<AkunButton
						name="Helpdesk"
						route="/drawer/help"
					/>
					<Divider />
					<AkunButton
						name="Rate Awan"
						route=""
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Keluar"
						route=""
					/>
				</View>
			</Body>
		</Container>
	)
}

export default Akun

const styles = StyleSheet.create({
	viewSeparator: {
		marginBottom: SizeList.base,
		// paddingHorizontal : sizeli
	}
})