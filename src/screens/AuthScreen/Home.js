import TextTicker from 'react-native-text-ticker'
import React, { useState, useEffect } from 'react'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Divider from 'src/components/Row/Divider'
import Axios from 'axios'
import { Wrapper } from 'src/components/View/Wrapper'
import { View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { Text } from 'src/components/Text/CustomText'
import { NewsCardPlaceholder } from 'src/components/LoadingPlaceholder'
import { Image } from 'src/components/CustomImage';
import { HOST_URL } from 'src/config'
import { HomeHeader } from 'src/components/Header/Header'
import { getProfile } from 'src/redux/actions/actionsUserData'
import { FontList } from 'src/styles/typography'
import { convertRupiah, getUserToken } from 'src/utils/authhelper'
import { ColorsList } from 'src/styles/colors'
import { CardTextImage } from 'src/components/Card/CardComp'
import { Button } from 'src/components/Button/Button'
import { AwanPopup } from 'src/components/ModalContent/Popups'
import { $Padding } from 'src/utils/stylehelper'
import Container, { Body } from 'src/components/View/Container';
import BarStatus from 'src/components/BarStatus';

const { width, height } = Dimensions.get('window')
const Home = ({ navigation }) => {
	const [flexStart] = [true]
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
		const userToken = await getUserToken()
		const res = await Axios.get(`${HOST_URL}/check_service`, {
			headers: { "authorization": userToken }
		})
		res.data.data.status == 2 && _featureDisabled();
		if (res.data.data.service == 1) {
			setMaintanance(true)
			setMessage(res.data.data.message)
		} else {
			setMaintanance(false)
		}
	}

	const _featureDisabled = (action, num) => {
		let title, message
		if (User.data.status == 2) {
			title = 'AKUN ANDA TERBLOKIR'
			message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${User.data.banned_log.code}`
		} else {
			switch (action) {
				case 'ppob':
					title = 'FITUR PAYMENT POINT'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				case 'stock':
					title = 'FITUR BELANJA STOK'
					message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
					break;
				case 'hutang':
					title = 'FITUR PENCATATAN HUTANG'
					message = 'Untuk saat ini layanan belum bisa di gunakan karena masih dalam tahap pengembangan'
					break;
				case 'blokir':
					title = 'AKUN ANDA TERBLOKIR'
					message = `Anda tidak dapat menggunakan layanan apapun, silahkan hubungi customer service dengan kode ${num}`
					break;
				case 'topup':
					title = 'FITUR TOPUP'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				case 'riwayat':
					title = 'FITUR RIWAYAT'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
				default:
					title = 'FITUR KASIR'
					message = 'Lengkapi profil anda, agar bisa menggunakan fitur-fitur yang tersedia'
					break;
			}
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
	const _onPressHutang = () => _featureDisabled('hutang')

	const _handlePressDrawer = () => {
		navigation.navigate('/drawer')
	}
	const [_alert, _setAlert] = useState(false)
	const [_alertTitle, _setAlertTitle] = useState('')
	const [_alertMessage, _setAlertMessage] = useState('')

	const _handleRefresh = async () => {
		const userToken = await getUserToken()
		dispatch(getProfile(User.data.id, userToken))
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
			let address = User.store.address_store
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
			_featureDisabled("topup")
		}
	}

	const _onPressRiwayat = () => {
		if (User.data.status == 1) {
			navigation.navigate('/ppob/riwayat')
		} else {
			_featureDisabled("riwayat")
		}
	}

	const _getFlagColor = (flag) => {
		switch (flag) {
			case 0:
				return null
			case 1:
				return ColorsList.danger
			case 2:
				return ColorsList.success
			default : 
				return null
		}
	}
	return (
		<Container>
			<Body style={{ padding: 5 }} refreshControl={<RefreshControl refreshing={onRefresh} onRefresh={_handleRefresh} />}>
				<View style={{ justifyContent: "center" }}>
					<BarStatus />
					<Wrapper justify="space-between" style={{ padding: 10, paddingBottom: 0 }}>
						<View>
							<Text align="left">Welcome,</Text>
							<Text align="left" font="SemiBold" size={16}>{User.data.name}</Text>
						</View>
						<View style={{ justifyContent: 'center' }}>
							<TouchableOpacity onPress={_onPressRiwayat}>
								<Icon color="grey" size={20} name="bell" />
							</TouchableOpacity>
						</View>
					</Wrapper>
				</View>
				<Wrapper justify="space-between" style={$Padding(10, 10)}>
					<View>
						<Text>Saldo Anda sebesar: </Text>
						<Wrapper>
							<Text color="primary" font="SemiBold">{convertRupiah(User.data.saldo || 0)}</Text>
							<TouchableOpacity onPress={_handleRefresh}>
								<Image source={require('src/assets/icons/home/refresh.png')} size={15} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						</Wrapper>
					</View>
					<Button width={80} onPress={_onPressTopUp} textProps={{ size: 10 }}>TOP UP</Button>
				</Wrapper>
				{User.store &&
					<TouchableOpacity onPress={() => navigation.navigate("Laporan")}>
						<Wrapper shadow style={{ backgroundColor: ColorsList.white, marginHorizontal: 10 }} justify="space-evenly">
							<View style={{ marginHorizontal: 10, paddingVertical: 10 }}>
								<Text align="center" size={12}>Transaksi hari ini:</Text>
								<Wrapper>
									<Text color={_getFlagColor(User.store.penjualan_flag)} align="center">{convertRupiah(User.store.penjualan_harian)}</Text>
									{User.store.penjualan_flag != 0 &&
										<Icon
											size={15}
											name={User.store.penjualan_flag == 2 ? "sort-up" : "sort-down"}
											color={_getFlagColor(User.store.penjualan_flag)}
										/>
									}
								</Wrapper>
							</View>
							<Divider flex />
							<View style={{ marginHorizontal: 10, paddingVertical: 10 }}>
								<Text align="center" size={12}>Keuntungan hari ini:</Text>
								<Wrapper>
									<Text color={_getFlagColor(User.store.profit_flag)} align="center">{convertRupiah(convertRupiah(User.store.profit_harian))}</Text>
									{User.store.profit_flag != 0 &&
										<Icon
											size={15}
											name={User.store.profit_flag == 2 ? "sort-up" : "sort-down"}
											color={_getFlagColor(User.store.profit_flag)}
										/>
									}
								</Wrapper>
							</View>
						</Wrapper>
					</TouchableOpacity>
				}
				<View
					style={styles.childContainer}>
					<AwanPopup.Title title={_alertTitle} message={_alertMessage} visible={_alert}>
						<View></View>
						<Button width='30%' onPress={_completeProfile}>OK</Button>
					</AwanPopup.Title>
					<View style={{ paddingVertical: 10 }}>
						<View style={{}}>
							{
								maintanance && <Button disabled color="info" wrapper={{ flexStart }}>
									<Icon color={ColorsList.info} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
									<TextTicker
										width="90%"
										style={{ color: ColorsList.info, fontFamily: FontList.regularFont }}
										duration={20000}
										loop
										bounce
										marqueeDelay={500}
									>{message}</TextTicker>
								</Button>
							}
							{
								User.store ?
									User.data.status == 0 &&
									<Button onPress={() => navigation.navigate('/drawer/settings/change-email')} color="purple" flexStart wrapper={{ flexStart }}>
										<Icon color={ColorsList.purple} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
										<Text color="purple">Verifikasi Email Anda Sekarang!</Text>
									</Button>
									:
									<Button onPress={() => navigation.navigate('/temp/create-pin')} flexStart color="warning" wrapper={{ flexStart }}>
										<Icon color={ColorsList.white} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
										<Text color="white">Lengkapi Profil Anda Sekarang! </Text>
										<Text color="white" style={{ textDecorationLine: 'underline' }}>Klik disini</Text>
									</Button>
							}
						</View>
						<Text font="SemiBold" style={{ paddingBottom: 10 }}>Quick Actions</Text>
						<TouchableOpacity onPress={_onPressCashier}>
							<Wrapper spaceBetween shadow style={styles.cardWrapper}>
								<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons/home/kasir.png")} />
								<View _width="75%">
									<Text font="SemiBold" color="primary">KASIR</Text>
									<Text size={12}>Masuk kedalam mode kasir dan atur penjualan kios atau warung</Text>
								</View>
							</Wrapper>
						</TouchableOpacity>
						<TouchableOpacity onPress={_onPressPayment}>
							<Wrapper spaceBetween shadow style={styles.cardWrapper}>
								<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons//home/ppob.png")} />
								<View _width="75%">
									<Text font="SemiBold" color="primary">PEMBAYARAN</Text>
									<Text size={12}>Lakukan pembayaran tagihan listrik, PDAM, pulsa, paket data, dll</Text>
								</View>
							</Wrapper>
						</TouchableOpacity>
						<TouchableOpacity onPress={_onPressStock}>
							<Wrapper spaceBetween shadow style={styles.cardWrapper}>
								<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons/home/restock.png")} />
								<View _width="75%">
									<Text font="SemiBold" color="primary">BELANJA STOK</Text>
									<Text size={12}>Dapatkan berbagai macam produk dan barang untuk kebutuhan kios atau warung</Text>
								</View>
							</Wrapper>
						</TouchableOpacity>
						<TouchableOpacity onPress={_onPressHutang}>
							<Wrapper spaceBetween shadow style={styles.cardWrapper}>
								<Image size={70} style={{ resizeMode: 'contain' }} _width="25%" source={require("src/assets/icons/home/hutang.png")} />
								<View _width="75%">
									<Text font="SemiBold" color="primary">PENCATATAN HUTANG</Text>
									<Text size={12}>Kelola hutang dan piutang usaha kios atau warung</Text>
								</View>
							</Wrapper>
						</TouchableOpacity>
					</View >
				</View >
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}>
					<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5, marginLeft: 10 }} source={require('src/assets/images/Banner.jpg')} />
					<Image style={{ width: width / 1.3, borderRadius: 5, height: height / 5, marginHorizontal: 10 }} source={require('src/assets/images/Banner2.jpg')} />
				</ScrollView>
				<Text style={{ paddingHorizontal: 15, paddingVertical: 5 }} font="SemiBold">Tahukah Kamu?</Text>
				{
					newsLoading ?
						<NewsCardPlaceholder />
						:
						<FlatList
							data={news}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
							renderItem={({ item, index }) => (
								<CardTextImage
									style={{ marginLeft: 10, marginRight: index == news.length - 1 ? 10 : 0 }}
									onPressCard={() => navigation.navigate('/news-screen', { title: item.title.rendered, data: item.content.rendered, newsImage: item.jetpack_featured_media_url, link: item.link })}
									image={item.jetpack_featured_media_url}
									info={item.title.rendered}
								/>
							)}
							keyExtractor={(item, index) => index.toString()}
						/>
				}
			</Body >
		</Container >
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
	},
	cardWrapper: {
		marginBottom: 10,
		backgroundColor: ColorsList.whiteColor,
		padding: 5
	}
})