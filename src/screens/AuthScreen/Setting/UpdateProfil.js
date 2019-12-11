import React, { useState } from 'react';
import { View, StyleSheet, Image, TextInput } from 'react-native';
import { GlobalHeader } from '../../../components/Header/Header';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from '../../../components/Text/CustomText';
import { ColorsList } from '../../../styles/colors';
import { FloatingInput } from '../../../components/Input/InputComp';

const UpdateProfil = ({ navigation }) => {
	const [nama, setNama] = useState()
	const inputan = [{
		label: "Nama",
		value: nama,
		handleChangeText: (text) => {
			setNama(text)
		}
	}, {
		label: "Email",
		// value="Email",
		handleChangeText: () => { }
	}, {
		label: "No. telepon",
		// value="No. telepon",
		handleChangeText: () => { }
	}, {
		label: "Nama toko / kios",
		// value="Nama toko / kios",
		handleChangeText: () => { }
	}, {
		label: "Alamat toko / kios",
		// value="Alamat toko / kios",
		handleChangeText: () => { }
	}]

	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Update Profil" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15 }}>
				<View style={{ paddingVertical: 30, paddingHorizontal: 15, marginBottom: 15, backgroundColor: 'white' }}>
					{
						inputan.map((input, i) => {
							return <FloatingInput key={i} style={styles.floatingInput} label={input.label}>
								<TextInput onChangeText={input.handleChangeText} value={input.value} />
							</FloatingInput>
						})
					}
				</View>
				<View>
					<Text style={{ marginBottom: 10, alignSelf: 'center', color: ColorsList.greyFont }}>Unggah Foto Toko</Text>
					<View style={styles.imageWrapper}>
						<TouchableOpacity style={{ backgroundColor: 'white' }}>
							<Image style={styles.image} source={require('../../../assets/images/img-product.png')} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	)
}

export default UpdateProfil

const styles = StyleSheet.create({
	floatingInput: { marginBottom: 15 },
	imageWrapper: { marginBottom: 10, borderStyle: 'dashed', borderColor: '#000', borderWidth: 1, height: 250 },
	image: { width: '100%', height: '100%' },
})