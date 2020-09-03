import { AwanPopup } from "src/components/ModalContent/Popups"
import { Button } from "src/components/Button/Button"
import { getProfile } from "src/redux/actions/actionsUserData"
import { getUserToken, checkService } from "src/utils/authhelper"
import { HOST_URL } from "src/config"
import { SizeList } from "src/styles/size"
import { useSelector, useDispatch } from "react-redux"
import { View, RefreshControl, Modal, BackHandler } from "react-native"
import Ads from "./Ads"
import Container, { Body } from "src/components/View/Container"
import Feature from "./Feature"
import Header from "./Header"
import Notification from "./Notification"
import React, { useState, useEffect } from "react"
import styles from "./style"
import Summary from "./Summary"
import ModalContent from "src/components/ModalContent/ModalContent"
import CreatePin from "./CreatePin"
import { Toast } from "native-base"
import { ColorsList } from "src/styles/colors"
import { NavigationEvents } from "react-navigation"
import axios from "src/utils/axios"

const Home = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const dispatch = useDispatch()

	const [maintenance, setMaintanance] = useState(false)
	const [message, setMessage] = useState(false)
	const [onRefresh, setOnRefresh] = useState(false)
	const [news, setNews] = useState()
	const [newsLoading, setNewsLoading] = useState(true)
	const [_modalVisible, _setModalVisible] = useState(false)
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState("")
	const [_alertMessage, _setAlertMessage] = useState("")

	const modalFn = [
		_setAlertMessage,
		_setAlert,
		_setModalVisible,
		_setAlertTitle,
	]

	const _getNewsData = async () => {
		const res = await axios.get("https://kiosawan.com/wp-json/wp/v2/posts")
		setNews(res.data)
		setNewsLoading(false)
	}

	const _checkService = async () => {
		const {
			data: { status, message, service },
		} = await checkService()
		status == 2 && _featureDisabled()
		if (service == 1) {
			setMaintanance(true)
			setMessage(message)
		} else {
			setMaintanance(false)
		}
	}

	const _featureDisabled = (action, num) => {
		let title, message
		if (User.data.status == 2) {
			title = "AKUN ANDA TERBLOKIR"
			message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${User.data.banned_log.code}`
		} else {
			switch (action) {
				case "ppob":
					title = "FITUR PAYMENT POINT"
					message =
						"Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia"
					break
				case "riwayat-disabled":
					title = "FITUR RIWAYAT"
					message =
						"Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan"
					break
				case "ppob-disabled":
					title = "FITUR PAYMENT POINT"
					message =
						"Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan"
					break
				case "topup-disabled":
					title = "FITUR TOP UP"
					message =
						"Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan"
					break
				case "stock":
					title = "FITUR BELANJA STOK"
					message =
						"Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan"
					break
				case "hutang":
					title = "FITUR PENCATATAN HUTANG"
					message =
						"Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan"
					break
				case "blokir":
					title = "AKUN ANDA TERBLOKIR"
					message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${num}`
					break
				case "topup":
					title = "FITUR TOPUP"
					message =
						"Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia"
					break
				case "riwayat":
					title = "FITUR RIWAYAT"
					message =
						"Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia"
					break
				default:
					title = "FITUR KASIR"
					message =
						"Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia"
					break
			}
		}
		_setAlertTitle(title)
		_setAlertMessage(message)
		_setAlert(true)
	}

	const _handleRefresh = async () => {
		_getUserInfo()
		_checkService()
		setOnRefresh(false)
	}

	const _getUserInfo = async () => {
		const userToken = await getUserToken()
		dispatch(getProfile(User.data.id, userToken))
	}

	const _completeProfile = () => {
		if (User.data.status == 2) {
			_setAlert(false)
		} else if (!User.store) {
			const [
				setAlertMessage,
				setAlert,
				setModalVisible,
				setAlertTitle,
			] = modalFn
			_setAlert(false)
			if (User.data.atur_pin == 1) {
				navigation.navigate("/temp/update-profile")
			} else {
				CreatePin({
					User,
					navigation,
					setAlertMessage,
					setAlert,
					setModalVisible,
					setAlertTitle,
					dispatch,
				})
			}
		} else if (User.data.status == 0) {
			_setAlert(false)
			navigation.navigate("/drawer/settings/change-email")
		} else {
			_setAlert(false)
		}
	}
	let [canExit, exitDuration] = [false, 1000]
	useEffect(() => {
		console.debug("render home")
		_checkService()
		_getNewsData()
		// BackHandler.addEventListener('hardwareBackPress', (e) => {
		// 	if (navigation.state.routeName == "Home") {
		// 		if (canExit) {
		// 			BackHandler.exitApp()
		// 		} else {
		// 			canExit = true
		// 			setTimeout(() => {
		// 				canExit = false
		// 			}, exitDuration)
		// 			Toast.show({
		// 				style: {
		// 					backgroundColor: ColorsList.blackTransparent,
		// 					marginHorizontal: 20,
		// 					marginBottom: 20,
		// 					borderRadius: 50,
		// 				},
		// 				textStyle: {
		// 					paddingHorizontal: 10,
		// 					textAlign: 'center',
		// 					fontSize: 13
		// 				},
		// 				text: "Tekan KEMBALI sekali lagi untuk keluar aplikasi"
		// 			})
		// 		}
		// 		return true
		// 	}
		// 	return false
		// })
	}, [])
	return (
		<Container>
			<NavigationEvents onDidFocus={_getUserInfo} />
			<AwanPopup.Title
				title={_alertTitle}
				message={_alertMessage}
				visible={_alert}>
				<View></View>
				<Button style={{ width: 100 }} onPress={_completeProfile}>
					OK
				</Button>
			</AwanPopup.Title>
			<Modal
				animationType="fade"
				transparent={true}
				visible={_modalVisible}
				onRequestClose={() => {
					_setModalVisible(!_modalVisible)
				}}>
				<ModalContent
					image={require("src/assets/images/createpinsuccess.png")}
					infoText="Anda Berhasil Membuat PIN!"
					closeModal={() => _setModalVisible(false)}
				/>
			</Modal>
			<Body
				style={{ padding: 0 }}
				refreshControl={
					<RefreshControl refreshing={onRefresh} onRefresh={_handleRefresh} />
				}>
				<View style={{ paddingHorizontal: SizeList.bodyPadding }}>
					<View style={{ paddingTop: SizeList.bodyPadding }}>
						<Header
							User={User}
							navigation={navigation}
							_handleRefresh={_handleRefresh}
							_featureDisabled={_featureDisabled}
						/>
					</View>

					{User.data.status == 1 && (
						<Summary User={User} navigation={navigation} />
					)}
					<View style={styles.childContainer}>
						<View style={{ paddingVertical: SizeList.base }}>
							<Notification
								User={User}
								message={message}
								navigation={navigation}
								maintenance={maintenance}
								modal={modalFn}
								dispatch={dispatch}
							/>
							<Feature
								User={User}
								navigation={navigation}
								_featureDisabled={_featureDisabled}
							/>
						</View>
					</View>
				</View>
				<Ads loading={newsLoading} newsData={news} navigation={navigation} />
			</Body>
		</Container>
	)
}

export default Home
