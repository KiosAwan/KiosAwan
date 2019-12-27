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
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Setting" onPressBack={() => navigation.navigate('/')} />
			<Grid style={{ backgroundColor: ColorsList.authBackground, height: 100 }}>
				<Row size={.75} style={{ backgroundColor: 'white', padding: 10 }}>
					<Col style={{ justifyContent: 'center' }} size={1.5}>
						<Icon name="contact" style={{ fontSize: 60, color: ColorsList.primaryColor }} />
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
											return <TouchableOpacity key={o} onPress={() => navigation.navigate(menu.route)} style={{
												backgroundColor: 'white',
												marginBottom: 5,
												borderRadius: 5,
												padding: 10,
												height: 45
											}}>
												<Grid>
													<Col style={{ alignItems: 'center' }} size={1}>
														<Icon name={menu.icon} style={{ color: ColorsList.primaryColor }} />
													</Col>
													<Col style={{ justifyContent: 'center', marginLeft: 10 }} size={8}>
														<Text>{menu.name}</Text>
													</Col>
													<Col style={{ justifyContent: 'center', alignItems: 'flex-end' }} size={1}>
														<Icon name="arrow-dropright" style={{ color: ColorsList.greySoft }} />
													</Col>
												</Grid>
											</TouchableOpacity>
										})
									}
									{/* <Text>Divider</Text> */}
								</Col>
							)
						})
					}
				</Row>
			</Grid>
			<View style={{ position: 'absolute', bottom: 10, alignSelf: "center" }}>
				<Text style={{ alignSelf: 'center', marginBottom: 10 }}>Versi</Text>
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