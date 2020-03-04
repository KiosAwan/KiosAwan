import React, { useState, useEffect } from 'react'
import {
	View,
	StyleSheet,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	RefreshControl,
	FlatList
} from 'react-native'
import TextTicker from 'react-native-text-ticker'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Divider from 'src/components/Row/Divider'
import Axios from 'axios'
import { ColorsList } from 'src/styles/colors'
import { FontList } from 'src/styles/typography'
import { useSelector, useDispatch } from 'react-redux'
import { CardTextImage } from 'src/components/Card/CardComp'
import { HOST_URL } from 'src/config'
import { HomeHeader } from 'src/components/Header/Header'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import { getProfile } from 'src/redux/actions/actionsUserData'
import { Image } from 'src/components/CustomImage';
import { Text } from 'src/components/Text/CustomText'
import { Button } from 'src/components/Button/Button'
import { Wrapper } from 'src/components/View/Wrapper'
import { NewsCardPlaceholder } from 'src/components/LoadingPlaceholder'
import { convertRupiah } from 'src/utils/authhelper'
import { $Padding } from 'src/utils/stylehelper'
import ParallaxScrollView from 'react-native-parallax-scroll-view';

const { width, height } = Dimensions.get('window')
const Home = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const dispatch = useDispatch()
	const [maintanance, setMaintanance] = useState(false)
	const [message, setMessage] = useState(false)
	const [onRefresh, setOnRefresh] = useState(false)
	const [news, setNews] = useState()
	const [newsLoading, setNewsLoading] = useState(true)
	useEffect(() => {
		_checkService()
		_getNewsData()
	}, [])
	const _getNewsData = async () => {
		const res = await Axios.get('https://kiosawan.com/wp-json/wp/v2/posts')
		setNews(res.data)
		setNewsLoading(false)
	}

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
				message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
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

	const _onPressPayment = () => {
		if (User.data.status == 1) {
			navigation.navigate('/ppob')
		} else {
			_featureDisabled('ppob')
		}
	}
	const _onPressStock = () => _featureDisabled('stock')

	const _handlePressDrawer = () => {
		navigation.navigate('/drawer')
	}
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState('')
	const [_alertMessage, _setAlertMessage] = useState('')

	const _handleRefresh = () => {
		dispatch(getProfile(User.data.id))
		_checkService()
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
	const _nameStore = () => {
		return User.store ? {
			children: User.store.name_store.toUpperCase()
		} : {
				children: 'Belum ada toko',
				font: 'BoldItalic'
			}
	}
	const _addressStore = () => {
		if (User.store && User.store.address_store) {
			let address = `${User.store.address_store.split('%')[0]}, ${User.store.address_store.split('%')[4]}`
			if (address.length > 30) {
				return address.substr(0, 30) + '...'
			}
			return address
		} else {
			return 'Lokasi belum di tentukan'
		}
	}

	const _onPressTopUp = () => {
		if (User.data.status == 1) {
			navigation.navigate('/ppob/topup')
		} else {
			_setAlertTitle("FITUR INI")
			_setAlertMessage("Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia")
			_setAlert(true)
		}
	}

	const _onPressRiwayat = () => {
		if (User.data.status == 1) {
			navigation.navigate('/ppob/riwayat')
		} else {
			_setAlertTitle("FITUR INI")
			_setAlertMessage("Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia")
			_setAlert(true)
		}
	}
	return <ParallaxScrollView
		refreshControl={<RefreshControl refreshing={onRefresh} onRefresh={_handleRefresh} />}
		showsVerticalScrollIndicator={false}
		backgroundColor={ColorsList.primary}
		contentBackgroundColor={ColorsList.authBackground}
		parallaxHeaderHeight={170}
		stickyHeaderHeight={55}
		renderStickyHeader={() => (
			<HomeHeader height={55} key="parallax-header" center={
				<View style={{ alignItems: 'center' }}>
					<Text color="whiteColor" {..._nameStore()} />
					<Wrapper>
						<Icon color="white" name="map-marker-alt" />
						<Text color="whiteColor"> {_addressStore()}</Text>
					</Wrapper>
				</View>
			} onPressMenu={_handlePressDrawer} onPressBell={() => { }} />
		)}
		renderForeground={() => <HomeHeader center={
			<View style={{ alignItems: 'center' }}>
				<Text color="whiteColor" {..._nameStore()} />
				<Wrapper>
					<Icon color="white" name="map-marker-alt" />
					<Text color="whiteColor"> {_addressStore()}</Text>
				</Wrapper>
			</View>
		} onPressMenu={_handlePressDrawer} onPressBell={() => { }}>
			<View style={{ borderRadius: 5, marginHorizontal: 10, backgroundColor: ColorsList.whiteColor }}>
				<Wrapper justify="space-between" style={$Padding(10, 15)}>
					<Wrapper justify="flex-start">
						<Image source={require('src/assets/icons/home/wallet.png')} size={15} style={{ marginRight: 10 }} />
						<Text>Saldo: {convertRupiah(User.data.saldo || 0)}</Text>
					</Wrapper>
					<Wrapper justify="flex-end">
						<Button color="link">
							<Image source={require('src/assets/icons/home/refresh.png')} size={15} />
						</Button>
						<Button onPress={_onPressTopUp} textProps={{ size: 10 }}>TOP UP</Button>
					</Wrapper>
				</Wrapper>
				<Divider />
				<Wrapper justify="space-around">
					<Button color="link" onPress={_onPressRiwayat}>
						<Image style={{ marginRight: 5 }} source={require('src/assets/icons/home/chart-up.png')} size={15} />
						<Text>Riwayat</Text>
					</Button>
					<Divider />
					<Button color="link">
						<Image style={{ marginRight: 5 }} source={require('src/assets/icons/home/coupon.png')} size={15} />
						<Text>Kupon</Text>
					</Button>
					<Divider />
					<Button color="link" onPress={() => navigation.navigate("/ppob/favorit")}>
						<Image style={{ marginRight: 5 }} source={require('src/assets/icons/home/star.png')} size={15} />
						<Text>Favorit</Text>
					</Button>
				</Wrapper>
			</View>
		</HomeHeader>
		}>
		<View
			style={styles.childContainer}>
			<AwanPopup.Title title={_alertTitle} message={_alertMessage} visible={_alert}>
				<View></View>
				<Button width='30%' onPress={_completeProfile}>OK</Button>
			</AwanPopup.Title>
			<View style={{ paddingVertical: 10 }}>
				{
					maintanance &&
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
				}
				{
					User.store ?
						User.data.status == 0 &&
						<TouchableOpacity onPress={() => navigation.navigate('/drawer/settings/change-email')} style={{ paddingBottom: 10 }}>
							<View style={{ borderRadius: 5, padding: 10, backgroundColor: '#ebcbfd', alignItems: "center", flexDirection: 'row' }}>
								<Icon color="#904bb7" name="exclamation-circle" style={{ marginHorizontal: 10 }} />
								<Text style={{ color: '#904bb7', fontFamily: FontList.regularFont, paddingHorizontal: 10 }}>Verifikasi Email Anda Sekarang!</Text>
							</View>
						</TouchableOpacity>
						:
						<TouchableOpacity onPress={() => navigation.navigate('/temp/create-pin')} style={{ paddingBottom: 10 }}>
							<View style={{ borderRadius: 5, padding: 10, backgroundColor: ColorsList.warning, alignItems: "center", flexDirection: 'row' }}>
								<Icon color={ColorsList.whiteColor} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
								<Text style={{ color: ColorsList.whiteColor, fontFamily: FontList.regularFont, paddingHorizontal: 10 }}>Lengkapi Profil Anda Sekarang!</Text>
								<Text style={{ color: ColorsList.whiteColor, fontFamily: FontList.regularFont, textDecorationLine: 'underline' }}>Klik disini</Text>
							</View>
						</TouchableOpacity>
				}
				<Button onPress={_onPressCashier} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
					<Wrapper justify="space-between">
						<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons/home/kasir.png")} />
						<View _width="75%">
							<Text font="ExtraBold" color="primary">KASIR</Text>
							<Text size={12}>Masuk kedalam mode kasir dan atur penjualan kios atau warung</Text>
						</View>
					</Wrapper>
				</Button>
				<Button onPress={_onPressPayment} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
					<Wrapper justify="space-between">
						<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons//home/ppob.png")} />
						<View _width="75%">
							<Text font="ExtraBold" color="primary">PAYMENT POINT</Text>
							<Text size={12}>Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll</Text>
						</View>
					</Wrapper>
				</Button>
				<Button onPress={_onPressStock} style={{ marginBottom: 10, backgroundColor: ColorsList.whiteColor }} color="link">
					<Wrapper justify="space-between">
						<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons/home/restock.png")} />
						<View _width="75%">
							<Text font="ExtraBold" color="primary">BELANJA STOK</Text>
							<Text size={12}>Dapatkan berbagai macam produk dan barang untuk kebutuhan kios atau warung</Text>
						</View>
					</Wrapper>
				</Button>
			</View>
		</View>
		<ScrollView
			horizontal={true}
			showsHorizontalScrollIndicator={false}>
			<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5, marginLeft: 10 }} source={require('src/assets/images/card_1.png')} />
			<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5, marginHorizontal: 10 }} source={require('src/assets/images/card_2.png')} />
		</ScrollView>
		<Text style={{ padding: 15 }} color="primary" font="Bold">TAHUKAH KAMU??</Text>
		{newsLoading ?
			<NewsCardPlaceholder />
			:
			<FlatList
				data={news}
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				renderItem={({ item, index }) => (
					<CardTextImage
						style={{ marginLeft: 10, marginRight: index == news.length - 1 ? 10 : 0 }}
						onPressCard={() => navigation.navigate('/news-screen', { title: item.title.rendered, data: item.content.rendered, newsImage: item.jetpack_featured_media_url })}
						image={item.jetpack_featured_media_url}
						info={item.title.rendered}
					/>
				)}
				keyExtractor={(item, index) => index.toString()}
			/>
		}
	</ParallaxScrollView>
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