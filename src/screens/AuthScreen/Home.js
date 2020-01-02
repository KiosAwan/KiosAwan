import React, { useState, useEffect } from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Text
} from 'react-native'
import TextTicker from 'react-native-text-ticker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SliderImage from '../../components/SliderImage'
import { ColorsList } from '../../styles/colors'
import { FontList } from '../../styles/typography'

//redux
import { useSelector, useDispatch } from 'react-redux'

//CustomComponent
import { CardComp, CardTextImage } from '../../components/Card/CardComp'
import { CategoryText } from '../../components/Text/CategoryText'
import Axios from 'axios'
import { HOST_URL } from 'src/config'
import { HomeHeader } from 'src/components/Header/Header'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import { Button } from 'src/components/Button/ButtonComp'
import { Spinner } from 'native-base'
import { getProfile } from 'src/redux/actions/actionsUserData'

const height = Dimensions.get('window').height
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

	const _onPressCashier = () => {
		navigation.navigate('/cashier')
	}

	const _onPressPayment = () => {
		_setAlertTitle('FITUR PAYMENT POINT')
		_setAlertMessage('Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan')
		_setAlert(true)
	}

	const _onPressStock = () => {
		_setAlertTitle('FITUR BELANJA STOK')
		_setAlertMessage('Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan')
		_setAlert(true)
	}

	const _handlePressDrawer = () => {
		navigation.navigate('/drawer')
	}
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState('')
	const [_alertMessage, _setAlertMessage] = useState('')

	const _handleRefresh = () => {
		dispatch(getProfile(User.data.id))
		console.debug(User.isLoading)
		setOnRefresh(false)
	}
	return (
		<View style={styles.container}>
			<HomeHeader onPressMenu={_handlePressDrawer} onPressBell={() => { }} />
			<AwanPopup.Title title={_alertTitle} message={_alertMessage} visible={_alert}>
				<View></View>
				<Button width='30%' onPress={() => _setAlert(false)}>OK</Button>
			</AwanPopup.Title>
			{onRefresh ? <Spinner color={ColorsList.primaryColor} style={{alignSelf : "center"}}></Spinner> : null}
			{onRefresh ?
				<Text style={{ alignSelf: 'center', ...FontList.titleFont, color : ColorsList.greySoft }}>Pull to refresh</Text>
				: null
			}
			<ScrollView
				onScrollBeginDrag={() => setOnRefresh(true)}
				onScrollEndDrag={_handleRefresh}
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
										<Text style={{ color: ColorsList.whiteColor, fontFamily: FontList.regularFont }}>Lengkapi profil Anda agar bisa menggunakan fitur-fitur yang tersedia</Text>
									</View>
								</View>
							</TouchableOpacity>}
					<CardComp info="KASIR"
						disabled={User.data.status == 1 ? false : true}
						subInfo="Masuk kedalam mode kasir dan atur penjualan kios atau warung"
						cardStyle={{ backgroundColor: 'white' }}
						icon={require("../../assets/icons/icon-cashier.png")}
						onPressCard={_onPressCashier}
					/>
					<CardComp info="PAYMENT POINT"
						disabled={User.data.status == 1 ? false : true}
						subInfo="Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll"
						icon={require("../../assets/icons/icon-payment.png")}
						cardStyle={{ backgroundColor: 'white' }}
						onPressCard={_onPressPayment}
					/>
					<CardComp info="BELANJA STOK"
						disabled={User.data.status == 1 ? false : true}
						subInfo="Dapatkan berbagai macam produk dan barang untuk kebutuhan kios atau warung"
						cardStyle={{ backgroundColor: 'white' }}
						icon={require("../../assets/icons/icon-restock.png")}
						onPressCard={_onPressStock}
					/>
				</View>
				<SliderImage />
				<View style={styles.infoCategoryStyle}>
					<CategoryText title="TAHUKAH KAMU??" />
				</View>
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