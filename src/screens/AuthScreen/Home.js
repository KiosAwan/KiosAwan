import React, { useState, useEffect } from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	RefreshControl
} from 'react-native'
import TextTicker from 'react-native-text-ticker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SliderImage from 'src/components/SliderImage'
import { ColorsList } from 'src/styles/colors'
import { FontList } from 'src/styles/typography'
import { useSelector, useDispatch } from 'react-redux'
import { CardTextImage } from 'src/components/Card/CardComp'
import { CategoryText } from 'src/components/Text/CategoryText'
import Axios from 'axios'
import { HOST_URL } from 'src/config'
import { HomeHeader } from 'src/components/Header/Header'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import { getProfile } from 'src/redux/actions/actionsUserData'
import { Image } from 'src/components/CustomImage';
import { Text } from 'src/components/Text/CustomText'
import { Button } from 'src/components/Button/Button'
import { Wrapper } from 'src/components/View/Wrapper'

const { width, height } = Dimensions.get('window')
const Home = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const dispatch = useDispatch()
	const [maintanance, setMaintanance] = useState(false)
	const [message, setMessage] = useState(false)
	const [onRefresh, setOnRefresh] = useState(false)

	useEffect(() => {
		_checkService()
	}, [])

	const _checkService = async () => {
		const res = await Axios.get(`${HOST_URL}/check_service`)
		if (res.data.data.service == 1) {
			setMaintanance(true)
			setMessage(res.data.data.message)
		} else {
			setMaintanance(false)
		}
	}

	const _featureDisabled = action => {
		let title, message
		switch (action) {
			case 'ppob':
				title = 'FITUR PAYMENT POINT'
				message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
				break;
			case 'stock':
				title = 'FITUR BELANJA STOK'
				message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
				break;
			default:
				title = 'FITUR KASIR'
				message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
				break;
		}
		_setAlertTitle(title)
		_setAlertMessage(message)
		_setAlert(true)
	}

	const _onPressCashier = () => {
		if (User.data.status == 1) {
			navigation.navigate('/cashier')
		} else {
			_featureDisabled()
		}
	}

	const _onPressPayment = () => _featureDisabled('ppob')
	const _onPressStock = () => _featureDisabled('stock')

	const _handlePressDrawer = () => {
		navigation.navigate('/drawer')
	}
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState('')
	const [_alertMessage, _setAlertMessage] = useState('')

	const _handleRefresh = () => {
		dispatch(getProfile(User.data.id))
		setOnRefresh(false)
	}

	const _completeProfile = () => {
		if (!User.store) {
			_setAlert(false)
			navigation.navigate('/temp/create-pin')
		}
		else if (User.data.status == 0) {
			_setAlert(false)
			navigation.navigate('/drawer/settings/change-email')
		} else {
			_setAlert(false)
		}
	}
	return (
		<View style={styles.container}>
			<HomeHeader onPressMenu={_handlePressDrawer} onPressBell={() => { }} />
			<AwanPopup.Title title={_alertTitle} message={_alertMessage} visible={_alert}>
				<View></View>
				<Button width='30%' onPress={_completeProfile}>OK</Button>
			</AwanPopup.Title>
			<ScrollView
				refreshControl={<RefreshControl refreshing={onRefresh} onRefresh={_handleRefresh} />}
				style={styles.childContainer} showsVerticalScrollIndicator={false}>
				<View style={{ paddingVertical: 10 }}>
					{
						maintanance ?
							<View style={{ borderRadius: 5, padding: 10, backgroundColor: '#d9e6f3', alignItems: "center", marginBottom: 10, flexDirection: 'row' }}>
								<Icon color={ColorsList.info} name="exclamation-circle" style={{ marginHorizontal: 10, }} />
								<TextTicker
									style={{ color: ColorsList.info, fontFamily: FontList.regularFont }}
									duration={20000}
									loop
									bounce
									marqueeDelay={500}
								>
									{message}
								</TextTicker>
							</View>
							: null}
					{
						User.store ? User.data.status == 0 ?
							<TouchableOpacity onPress={() => navigation.navigate('/drawer/settings/change-email')} style={{ paddingBottom: 10 }}>
								<View style={{ borderRadius: 5, padding: 10, backgroundColor: '#ebcbfd', alignItems: "center", flexDirection: 'row' }}>
									<Icon color="#904bb7" name="exclamation-circle" style={{ marginHorizontal: 10 }} />
									<Text style={{ color: '#904bb7', fontFamily: FontList.regularFont, paddingHorizontal: 10 }}>Verifikasi Email Anda Sekarang!</Text>
								</View>
							</TouchableOpacity>
							: null :
							<TouchableOpacity onPress={() => navigation.navigate('/temp/create-pin')} style={{ paddingBottom: 10 }}>
								<View style={{ borderRadius: 5, padding: 10, backgroundColor: ColorsList.warning, alignItems: "center", flexDirection: 'row' }}>
									<Icon color={ColorsList.whiteColor} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
									<View style={{ width: '80%' }}>
										<Text style={{ color: ColorsList.whiteColor, fontFamily: FontList.regularFont }}>
											Lengkapi profil Anda agar bisa menggunakan fitur-fitur yang tersedia. <Text style={{ color: ColorsList.whiteColor, textDecorationLine: 'underline' }}>Klik disini</Text>
										</Text>
									</View>
								</View>
							</TouchableOpacity>
					}
					<Button onPress={_onPressCashier} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
						<Wrapper justify="space-between">
							<Image size={75} _width="25%" source={require("src/assets/icons/icon-cashier.png")} />
							<View _width="75%">
								<Text font="ExtraBold" color="primary">KASIR</Text>
								<Text size={12}>Masuk kedalam mode kasir dan atur penjualan kios atau warung</Text>
							</View>
						</Wrapper>
					</Button>
					<Button onPress={_onPressPayment} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
						<Wrapper justify="space-between">
							<Image size={75} _width="25%" source={require("src/assets/icons/icon-payment.png")} />
							<View _width="75%">
								<Text font="ExtraBold" color="primary">PAYMENT POINT</Text>
								<Text size={12}>Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll</Text>
							</View>
						</Wrapper>
					</Button>
					<Button onPress={_onPressStock} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
						<Wrapper justify="space-between">
							<Image size={75} _width="25%" source={require("src/assets/icons/icon-restock.png")} />
							<View _width="75%">
								<Text font="ExtraBold" color="primary">BELANJA STOK</Text>
								<Text size={12}>Dapatkan berbagai macam produk dan barang untuk kebutuhan kios atau warung</Text>
							</View>
						</Wrapper>
					</Button>
				</View>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}>
					<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5 }} source={require('src/assets/images/card_1.png')} />
					<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5, marginLeft: 10 }} source={require('src/assets/images/card_2.png')} />
				</ScrollView>
				<Text style={{ paddingVertical: 15 }} color="primary" font="Bold">TAHUKAH KAMU??</Text>
				<ScrollView
					horizontal={true}
					style={{ paddingBottom: 15, height: height / 3 }}
					showsHorizontalScrollIndicator={false}>
					<CardTextImage
						onPressCard={() => navigation.navigate('/cashier/news-screen', { weburl: 'https://kiosawan.com/peta-persaingan-50-e-commerce-di-indonesia/' })}
						image="https://kiosawan.com/wp-content/uploads/2019/11/blog-02a-780x390.jpg"
						info="Peta Persaingan 50 E-Commerce di Indonesia Versi IPRICE 2019"
					/>
					<CardTextImage
						onPressCard={() => navigation.navigate('/cashier/news-screen', { weburl: 'https://kiosawan.com/potensi-fintech-dukung-umkm/' })}
						image="https://kiosawan.com/wp-content/uploads/2019/11/blog-01-780x390.jpg"
						info="Mengulik Potensi Fintech untuk Mendukung UMKM"
					/>
				</ScrollView>
			</ScrollView>
		</View>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		backgroundColor: ColorsList.authBackground,
		flex: 1
	},
	childContainer: {
		marginHorizontal: 10,
	},
	firstChildView: {
		height: 80,
	},
	thirdChildView: {
		height: height / 3,
		borderWidth: 1
	},
	fourthChildView: {
		height: height / 3,
		borderWidth: 1
	},
	wrapChildRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	locationInfo: {
		paddingLeft: 5,
		color: 'white',
		...FontList.subtitleFont
	},
	nameAndLoc: {
		justifyContent: "center",
		alignItems: "center"
	},
	infoCategoryStyle: {
		paddingVertical: 10
	}
})