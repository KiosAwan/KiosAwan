import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import IonIcon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import BarStatus from 'src/components/BarStatus';
import { useSelector, useDispatch } from 'react-redux';
import { convertRupiah, getUserToken } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { PPOBCard } from 'src/components/Card/CardIcon';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Button } from 'src/components/Button/Button';
import { Image } from 'src/components/CustomImage';
import { $Padding } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Bottom } from 'src/components/View/Bottom';
import { getProductPPOBList } from 'src/utils/api/ppobapi';
import { DEV_IMG_URL, HOST_URL } from 'src/config';
import { getProfile } from 'src/redux/actions/actionsUserData'
import TextTicker from 'react-native-text-ticker';
import Axios from 'axios';
import { FontList } from 'src/styles/typography';
import Menu from 'src/components/ModalContent/Menu';
import Container, { Body } from 'src/components/View/Container';

const PPOB = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const Product = useSelector(state => state.Product)
	const [moreVisible, setMoreVisible] = useState(false)
	const [productData, setProductData] = useState()
	const [maintanance, setMaintanance] = useState(false)
	const [message, setMessage] = useState(false)
	useEffect(() => {
		_checkService()
		_getProductList()
	}, [])

	const _checkService = async () => {
		const userToken = await getUserToken()
		const res = await Axios.get(`${HOST_URL}/check_service`, {
			headers: { "authorization": userToken }
		})
		if (res.data.data.service == 1) {
			setMaintanance(true)
			setMessage(res.data.data.message)
		} else {
			setMaintanance(false)
		}
	}

	const _getProductList = async () => {
		const res = await getProductPPOBList()
		setProductData(res.data)
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
	const _navigateProduct = route => {
		navigation.navigate(route)
	}
	const _moreMenu = () => setMoreVisible(true)
	return (
		<Container header={{
			onPressBack: () => navigation.goBack(),
			handleDeleteCategory: () => _moreMenu(),
			title: "PEMBAYARAN",
			image: require('src/assets/icons/clock.png'),
		}}>
			{/* <Button style={{ alignItems: "center" }} _width="49%" color="link" onPress={() => navigation.navigate("/ppob/favorit")}>
				<Image style={{ marginRight: 5 }} source={require('src/assets/icons/home/star.png')} size={15} />
				<Text>Favorit</Text>
			</Button> */}
			<Menu
				menuColor="link"
				bgColor="transparent"
				position="topRight"
				style={{ backgroundColor: ColorsList.white }}
				data={[{ name: 'Atur Harga PPOB', route: '/ppob/settings' }, { name: 'List Transaksi', route: '/ppob/list-transaksi' }]}
				state={setMoreVisible}
				visible={moreVisible}
				onSelect={({ item: { route } }) => navigation.navigate(route)}
				renderItem={({ name }) => <Text align="left">{name}</Text>}
			/>
			<Body style={{ padding: 0 }}>

				<Wrapper justify="space-between" style={$Padding(10, 15)}>
					<View>
						<Text>Saldo Anda sebesar: </Text>
						<Wrapper>
							<Text color="primary" font="Bold">{convertRupiah(User.data.saldo || 0)}</Text>
							<TouchableOpacity onPress={async () => {
								const userToken = await getUserToken()
								dispatch(getProfile(User.data.id, userToken))
							}}>
								<Image source={require('src/assets/icons/home/refresh.png')} size={15} style={{ marginLeft: 10 }} />
							</TouchableOpacity>
						</Wrapper>
					</View>
					<Button width={80} onPress={_onPressTopUp} textProps={{ size: 10 }}>TOP UP</Button>
				</Wrapper>
				{
					maintanance &&
					<Button style={{ margin: 10 }} disabled color="info" wrapper={{ flexStart: true }}>
						<Icon color={ColorsList.info} name="exclamation-circle" style={{ marginHorizontal: 10, }} />
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
				{!productData ?
					<ActivityIndicator color={ColorsList.primary} />
					: <FlatList
						style={{ marginHorizontal: 10, marginVertical: 5 }}
						showsVerticalScrollIndicator={false}
						data={productData}
						numColumns={3}
						renderItem={({ item }) => (
							<View style={{ width: "33.3%", alignItems: "center", marginVertical: 10 }}>
								<PPOBCard
									status={item.status}
									info={item.info}
									onPress={() => _navigateProduct(`/ppob/${item.type}`)}
									icon={`${DEV_IMG_URL}/${item.icon}`}
									name={item.name}
								/>
							</View>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>}

				{
					Product.jumlahitem > 0 ?
						<Bottom>
							<Button onPress={() => {
								navigation.navigate('/cashier/cart')
							}} width="100%">
								<Wrapper>
									<IonIcon style={{ color: ColorsList.whiteColor, marginRight: 10, fontSize: 30 }} name="ios-cart" />
									<Text color="white">BELANJA {Product.jumlahitem} PRODUK</Text>
								</Wrapper>
								<View style={{ backgroundColor: ColorsList.primarySoft, height: '100%', width: 2 }} />
								<View style={{ justifyContent: 'center' }}>
									<Text color="white">{convertRupiah(Product.total)}</Text>
								</View>
							</Button>
						</Bottom>
						:
						null
				}
			</Body>
		</Container>
	)
}
export default PPOB

const styles = StyleSheet.create({
	wrapSaldoInfo: {
		padding: 20
	}
})