import { openPin } from "src/utils/pin-otp-helper"
import { createUserPIN } from "src/utils/authhelper"
import { NavigationActions, StackActions } from "react-navigation"

const CreatePin = ({ User, navigation, setAlertMessage, setAlert, setModalVisible, setAlertTitle }) => {
	const onResolve = async (pin, confirmPin) => {
		setAlertTitle('Peringatan')
		if (pin.length != 4 || confirmPin.length != 4) {
			setAlertMessage("PIN harus 4 digit")
			setAlert(true)
		} else if (pin != confirmPin) {
			setAlertMessage("PIN harus sama")
			setAlert(true)
		} else {
			setModalVisible(true)
			const id = User.data.id
			const data = { id, pin }
			const res = await createUserPIN(data)
			if (res.status == 200) {
				setTimeout(() => {
					setModalVisible(false)
					navigation.dispatch(
						StackActions.reset({
							index: 1,
							key: null,
							actions: [
								NavigationActions.navigate({ routeName: '/' }),
								NavigationActions.navigate({ routeName: '/temp/update-profile' })
							]
						})
					)
				}, 1000)
			} else {
				setAlertMessage("Gagal membuat PIN")
				setAlert(true)
			}
		}

	}
	const newPinConfirm = pin => openPin({
		navigation: navigation.push,
		title: 'Buat PIN',
		textTitle: 'Ulangi buat 4 digit PIN anda',
		info: 'Untuk menunjang keamanan profil anda, buatlah PIN dengan benar',
		onResolve: confirmPin => onResolve(pin, confirmPin)
	})
	openPin({
		navigation: navigation.push,
		title: 'Buat PIN',
		textTitle: 'Buat 4 digit PIN anda',
		info: 'Untuk menunjang keamanan profil anda, buatlah PIN dengan benar',
		onResolve: pin => newPinConfirm(pin)
	})
}

export default CreatePin