import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import { Button } from 'native-base';

const Setting = ({ navigation }) => {
	const ListMenu = require('../../../assets/json/setting.json')
	return (
		<View>
			<GlobalHeader title="Setting" onPressBack={() => navigation.goBack()} />
			<View name="Header"></View>
			<View name="">
				{
					ListMenu.map(groupMenu => {
						return (
							<View>
								{
									groupMenu.map(menu => {
										return <Button>
											<Text>{menu.name}</Text>
										</Button>
									})
								}
								<Text>_____________________________________________</Text>
							</View>
						)
					})
				}
			</View>
		</View>
	)
}

export default Setting