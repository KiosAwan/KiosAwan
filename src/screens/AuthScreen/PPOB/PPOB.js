import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import Icon from 'react-native-vector-icons/FontAwesome5'
import IonIcon from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import BarStatus from 'src/components/BarStatus';
import { useSelector, useDispatch } from 'react-redux';
import { convertRupiah } from 'src/utils/authhelper';
import { ColorsList } from 'src/styles/colors';
import { CardIcon } from 'src/components/Card/CardIcon';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { Button } from 'src/components/Button/Button';
import { Image } from 'src/components/CustomImage';
import { $Padding } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { Bottom } from 'src/components/View/Bottom';

const PPOB = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const Product = useSelector(state => state.Product)
	const [moreVisible, setMoreVisible] = useState(false)
	const productData = [
		{ icon: require('src/assets/icons/ppob/pulsa.png'), name: "Pulsa", navigate: "/ppob/pulsa" },
		{ icon: require('src/assets/icons/ppob/Paket-data.png'), name: "Paket data", navigate: "/ppob/paketdata" },
		{ icon: require('src/assets/icons/ppob/PLN.png'), name: "Listrik", navigate: '/ppob/listrik' },
		{ icon: require('src/assets/icons/ppob/BPJS.png'), name: "BPJS", navigate: "/ppob/bpjs" },
		{ icon: require('src/assets/icons/ppob/PDAM.png'), name: "PDAM", navigate: "/ppob/pdam" },
		{ icon: require('src/assets/icons/ppob/Asuransi.png'), name: "Asuransi", navigate: "/ppob/asuransi" },
		{ icon: require('src/assets/icons/ppob/E-Money.png'), name: "E - Money", navigate: "/ppob/emoney" },
		{ icon: require('src/assets/icons/ppob/Games.png'), name: "Games", navigate: "/ppob" },
		{ icon: require('src/assets/icons/ppob/Kredit.png'), name: "Kredit", navigate: "/ppob/kredit" },
		{ icon: require('src/assets/icons/ppob/Telkom.png'), name: "Telkom", navigate: "/ppob/telkom" },
		{ icon: require('src/assets/icons/ppob/TV-Kabel.png'), name: "TV Kabel", navigate: "/ppob/tvkabel" },
		{ icon: require('src/assets/icons/ppob/Zakat.png'), name: "Zakat", navigate: "/ppob" },
	]

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
		<View style={{ flex: 1 }}>
			<ParallaxScrollView
				showsVerticalScrollIndicator={false}
				backgroundColor={ColorsList.primary}
				contentBackgroundColor={ColorsList.authBackground}
				parallaxHeaderHeight={170}
				stickyHeaderHeight={50}
				renderStickyHeader={() => (
					<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{ height: 50, justifyContent: "center" }}>
						<BarStatus />
						<Wrapper justify="space-between" style={{ padding: 15, paddingTop: 5 }}>
							<View style={{ justifyContent: 'center' }}>
								<TouchableOpacity onPress={() => navigation.goBack()}>
									<Icon color="white" size={20} name="arrow-left" />
								</TouchableOpacity>
							</View>
							<Text color="whiteColor">PAYMENT POINT</Text>
							<View style={{ justifyContent: 'center' }}>
								<TouchableOpacity onPress={_moreMenu}>
									<Icon color="white" size={20} name="ellipsis-v" />
								</TouchableOpacity>
							</View>
						</Wrapper>
					</LinearGradient>
				)}
				renderForeground={() => (
					<LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{ height: 170, justifyContent: "center" }}>
						<BarStatus />
						<Wrapper justify="space-between" style={{ padding: 15, paddingTop: 10, alignItems: "center" }}>
							<View style={{ justifyContent: 'center' }}>
								<TouchableOpacity onPress={() => navigation.goBack()}>
									<Icon color="white" size={20} name="arrow-left" />
								</TouchableOpacity>
							</View>
							<Text color="whiteColor">PAYMENT POINT</Text>
							<View style={{ justifyContent: 'center' }}>
								<TouchableOpacity onPress={_moreMenu}>
									<Icon color="white" size={20} name="ellipsis-v" />
								</TouchableOpacity>
							</View>
						</Wrapper>
						<View style={{ borderRadius: 5, justifyContent: "flex-end", margin: 10, marginTop: 20, backgroundColor: ColorsList.whiteColor }}>
							<Wrapper justify="space-between" style={$Padding(10, 15)}>
								<Wrapper justify="flex-start">
									<Image source={require('src/assets/icons/home/wallet.png')} size={15} style={{ marginRight: 10 }} />
									<Text>Saldo: {convertRupiah(User.data.saldo)}</Text>
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
								<Button color="link">
									<Image style={{ marginRight: 5 }} source={require('src/assets/icons/home/star.png')} size={15} />
									<Text>Favorit</Text>
								</Button>
							</Wrapper>
						</View>
					</LinearGradient>
				)}>
				<FlatList
					style={{ margin: 10 }}
					showsVerticalScrollIndicator={false}
					data={productData}
					numColumns={3}
					renderItem={({ item }) => (
						<View style={{ flex: 1, alignItems: "center", marginVertical: 10 }}>
							<CardIcon
								onPress={() => _navigateProduct(item.navigate)}
								icon={item.icon}
								name={item.name}
							/>
						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
				<AwanPopup.Menu noTitle transparent absolute visible={moreVisible}
					backdropDismiss={() => setMoreVisible(false)}
					style={{ top: 10, right: 5, minWidth: '50%' }}
					contentStyle={{ elevation: 5, backgroundColor: ColorsList.whiteColor }}
				>
					<Button onPress={() => {
						setMoreVisible(false)
						navigation.navigate('/ppob/settings')
					}} color="link" textProps={{ size: 13 }}>Atur Harga Produk</Button>
				</AwanPopup.Menu>
			</ParallaxScrollView>

			{
				Product.jumlahitem > 0 ?
					<Bottom>
						<Button onPress={() => {
							navigation.navigate('/cashier/cart')
							dispatch(getCustomer(User.store.id_store))
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
		</View>
	)
}
export default PPOB

const styles = StyleSheet.create({
	wrapSaldoInfo: {
		padding: 20
	}
})