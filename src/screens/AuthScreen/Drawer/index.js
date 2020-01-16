import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View } from 'react-native';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { Icon, Grid, Col, Row } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText'
import { BottomButton } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';

const Akun = ({ navigation }) => {
	const ListMenu = require('src/assets/json/drawer.json')
	const User = useSelector(state => state.User)
	const _onPressLogout = async (props) => {
		try {
			await AsyncStorage.removeItem('userId')
			navigation.navigate('/unauth')
		}
		catch (e) {
			alert(e)
		};

	}
	const images = [
		require('src/assets/icons/setting1.png'),
		require('src/assets/icons/setting2.png'),
		require('src/assets/icons/setting3.png'),
		require('src/assets/icons/setting4.png'),
		require('src/assets/icons/setting5.png'),
		require('src/assets/icons/setting6.png')
	]
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Setting" onPressBack={() => navigation.navigate('/')} />
			<Grid style={{ backgroundColor: ColorsList.authBackground, height: 100 }}>
				<Row size={.75} style={{ backgroundColor: 'white', padding: 10 }}>
					<Col style={{ justifyContent: 'center' }} size={1.5}>
					<Image size={50} source={require('src/assets/icons/profile.png')} />
					</Col>
					<Col style={{ justifyContent: 'center' }} size={8}>
						<Grid style={{ justifyContent: 'center' }}>
							<Row>
								<Text>{User.data.name}</Text>
							</Row>
							<Row>
								<Text>{User.store ? User.store.name_store : '~ Belum Ada Toko ~'}</Text>
							</Row>
						</Grid>
					</Col>
				</Row>
				<Row size={9}>
					{
						ListMenu.map((groupMenu, i) => {
							return (
								<Col key={i} style={{ padding: '5%' }}>
									{
										groupMenu.map((menu, o) => {											
											return <TouchableOpacity key={o} onPress={() => User.store ? User.data.status == 1 ? navigation.navigate(menu.route) : null : null} style={{
												backgroundColor: 'white',
												marginBottom: 5,
												borderRadius: 5,
												padding: 10,
												height: 45
											}}>
												<Grid>
													<Col style={{ alignItems: 'center', justifyContent : "center" }} size={1}>
														<Image size={30} source={images[o]} />
													</Col>
													<Col style={{ justifyContent: 'center', marginLeft: 10 }} size={8}>
														<Text>{menu.name}</Text>
													</Col>
													<Col style={{ justifyContent: 'center', alignItems: 'flex-end' }} size={1}>
														<Image size={20} source={require('src/assets/icons/next.png')} />
													</Col>
												</Grid>
											</TouchableOpacity>
										})
									}
								</Col>
							)
						})
					}
				</Row>
			</Grid>
			<View style={{ position: 'absolute', bottom: 10, alignSelf: "center" }}>
				<Text style={{ alignSelf: 'center', marginBottom: 10 }}>Versi 1.0.0</Text>
				<BottomButton
					onPressBtn={_onPressLogout}
					style={{ width: SizeList.width - 30, backgroundColor: ColorsList.primaryColor }}
					buttonTitle="LOGOUT"
				/>
			</View>
		</View>
	)
}

export default Akun