import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import SearchInput from '../../../../components/Input/SearchInput';
import { GlobalHeader } from '../../../../components/Header/Header';

const ManajemenProduk = ({ navigation }) => {
	const [search, setSearch] = useState('')
	return (
		<View>
			<GlobalHeader title="Produk"
				onPressBack={() => navigation.goBack()} />
			<View style={{padding : 20}}>
				<SearchInput
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<Text>Diskon</Text>
			</View>
		</View>
	);
}

export default ManajemenProduk