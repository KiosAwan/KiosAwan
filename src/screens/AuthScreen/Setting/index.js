import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import { Button, Icon, Item, Grid, Col, Row } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { ColorsList } from '../../../styles/colors';
import { WrapperItem } from '../../../components/Picker/SelectBoxModal';
import { FontList } from '../../../styles/typography';
import { BottomButton } from '../../../components/Button/ButtonComp';
import { SizeList } from '../../../styles/size';

const Setting = ({ navigation }) => {
	const ListMenu = require('../../../assets/json/setting.json')
	const _onPressLogout = async (props) => {
		try {
			await AsyncStorage.removeItem('userId')
			navigation.navigate('UnauthNavigator')
		}
		catch (e) {
			alert(e)
		};

	}
	return (
		<View style={{ flex: 1 }}>
			<GlobalHeader title="Setting" onPressBack={() => navigation.goBack()} />
			<Grid style={{ backgroundColor: ColorsList.authBackground, height: 100 }}>
				<Row size={.75} style={{ backgroundColor: 'white', padding: 10 }}>
					<Col style={{ justifyContent: 'center' }} size={1.5}>
						<Icon name="contact" style={{ fontSize: 60 }} />
					</Col>
					<Col style={{ justifyContent: 'center' }} size={8}>
						<Grid style={{  justifyContent: 'center' }}>
							<Row>
								<Text>Name</Text>
							</Row>
							<Row>
								<Text>Name</Text>
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
													<Col style={{ justifyContent: 'center' }} size={1}>
														<Icon name={menu.icon} />
													</Col>
													<Col style={{ justifyContent: 'center' }} size={8}>
														<Text>{menu.name}</Text>
													</Col>
													<Col style={{ justifyContent: 'center', alignItems: 'flex-end' }} size={1}>
														<Icon name="arrow-dropright" />
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

export default Setting