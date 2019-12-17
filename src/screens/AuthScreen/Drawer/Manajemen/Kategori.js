import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import { GlobalHeader } from '../../../../components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import SearchInput from '../../../../components/Input/SearchInput';
import { ManagementCard } from '../../../../components/Card/ManagementCard';

const ManajemenKategori = ({ navigation }) => {

	const dispatch = useDispatch()

	const Category = useSelector(state => state.Category)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	useEffect(() => {
		dispatch(getCategory(User.store.id_store))
	}, [])

	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Kategori"
			/>
			<View style={{ padding: 20 }}>
				<SearchInput
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<View style={{paddingTop : 10}}>
					<FlatList
						data={Category.data.filter(item => item.name_product_category.toLowerCase().includes(search.toLowerCase()))}
						renderItem={({ item }) => (
							<View>
								<ManagementCard
									name={item.name_product_category}
								/>
							</View>
						)}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
			</View>
		</View>
	);
}

export default ManajemenKategori

const styles = StyleSheet.create({
	searchWrapper: {
		flexDirection: 'row',
		alignItems: "center",
		justifyContent: 'space-around'
	},
	textInput: {
		width: '75%',
		fontWeight: '500',
		textDecorationLine: 'none',
		fontFamily: FontList.regularFont,
		color: ColorsList.primaryColor
	},
	deleteIcon: {
		width: '5%',
		alignItems: "center",
		justifyContent: "center"
	}
})