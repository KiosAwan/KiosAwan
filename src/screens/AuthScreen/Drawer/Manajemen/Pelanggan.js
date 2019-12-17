import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import Axios from 'axios';
import { HOST_URL } from '../../../../config';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ManajemenPelanggan = ({ navigation }) => {
	const [token , setToken] = useState()
	const _cobaJWT = async () => {
		const res = await Axios.get('http://18.136.202.75/rest/test/tos')
		alert(res.data.data)
		setToken(res.data.data)
	}

	const _sendToken = async () => {
		const data = {}
		const res = await Axios.post('http://18.136.202.75/rest/test/tos',data, {
			headers: {
				Authorization: token
			}
		})
		alert(JSON.stringify(res.data))
	}
	return (
		<View>
			<TouchableOpacity onPress={_cobaJWT}>
				<Text>Get token</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={_sendToken}>
				<Text>Tes jwt</Text>
			</TouchableOpacity>
		</View>
	);
}

export default ManajemenPelanggan