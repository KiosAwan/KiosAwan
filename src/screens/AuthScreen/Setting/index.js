import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import { Button } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

const Setting = ({ navigation }) => {
	const ListMenu = require('../../../assets/json/setting.json')
	const _onPressLogout= async (props) => {
		try {
			await AsyncStorage.removeItem('userId')
			navigation.navigate('UnauthNavigator')
		  } 
		  catch(e) {
			  alert(e)      
		};
	  
	  }
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
			<TouchableOpacity onPress={_onPressLogout}>
				<Text>Logout</Text>
			</TouchableOpacity>
		</View>
	)
}

export default Setting