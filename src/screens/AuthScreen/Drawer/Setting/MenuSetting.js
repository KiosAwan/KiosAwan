import React, { Component } from 'react';
import { View } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { Grid, Col, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '../../../../components/Text/CustomText';

const MenuSetting = ({ navigation }) => {
	const ListMenuSetting = require('../../../../assets/json/setting.json')
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Pengaturan" onPressBack={() =>	navigation.navigate('/drawer')} />
			<View style={{ padding: 15 }}>
				{
					ListMenuSetting.map((menu, i) => {
						return <TouchableOpacity key={i} onPress={() => navigation.navigate(menu.route)} style={{
							backgroundColor: 'white',
							marginBottom: 5,
							borderRadius: 5,
							padding: 10,
							height: 45
						}}>
							<Grid>
								<Col style={{ justifyContent: 'center', marginLeft: 10 }} size={9}>
									<Text style={{ color: ColorsList.greyFont }}>{menu.name}</Text>
								</Col>
								<Col style={{ justifyContent: 'center', alignItems: 'flex-end' }} size={1}>
									<Icon name="arrow-dropright" style={{ color: ColorsList.greySoft }} />
								</Col>
							</Grid>
						</TouchableOpacity>
					})
				}
			</View>
		</View>
	)
}

export default MenuSetting
