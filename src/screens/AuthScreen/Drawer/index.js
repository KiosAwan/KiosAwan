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
import { Button } from 'src/components/Button/Button';

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
			<Grid style={{ backgroundColor: ColorsList.authBackground, height: 170, justifyContent: 'space-between' }}>
				<Row size={1.2} style={{ backgroundColor: 'white', padding: 10, alignItems: "center" }}>
					<Col style={{ justifyContent: 'center' }} size={2}>
						<Image size={50} source={require('src/assets/icons/profile.png')} />
					</Col>
					<Col style={{ justifyContent: 'center' }} size={8}>
						<Grid style={{ justifyContent: 'center' }}>
							<Row>
								<Text color="primary">{User.data.name}</Text>
							</Row>
							<Row>
								<Text>{User.store ? User.store.name_store : '~ Belum Ada Toko ~'}</Text>
							</Row>
							<Row>
								<Text>#AWN00000001</Text>
							</Row>
						</Grid>
					</Col>
					<View style={{borderWidth : 1, padding : 5,borderColor :ColorsList.greyFont,borderRadius : 5}}>
						<Text>Free User</Text>
					</View>
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
													<Col style={{ alignItems: 'center', justifyContent: "center" }} size={1}>
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
			<View style={{ position: 'absolute', bottom: 10, alignSelf: "center", width: '90%' }}>
				<Text style={{ alignSelf: 'center', marginBottom: 10 }}>Versi 1.0.0</Text>
				<Button width="100%" style={{ marginBottom: 10 }}>UPGRADE KE PREMIUM</Button>
				<Button color="white" width="100%" onPress={_onPressLogout}>KELUAR</Button>
			</View>
		</View>
	)
}

export default Akun