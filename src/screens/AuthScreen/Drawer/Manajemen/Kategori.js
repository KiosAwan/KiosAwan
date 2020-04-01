import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import { GlobalHeader } from '../../../../components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import SearchInput from '../../../../components/Input/SearchInput';
import { ManagementCategoryCard } from '../../../../components/Card/ManagementCard';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';

const ManajemenKategori = ({ navigation }) => {

	const dispatch = useDispatch()

	const Category = useSelector(state => state.Category)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	useEffect(() => {
		dispatch(getCategory(User.store.id_store))
	}, [])

	const _handleAddNewCategory = () => {
		navigation.navigate('/drawer/manajemen/kategori/add')
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Kategori"
			/>
			<View style={{ padding: 20, flex: 1 }}>
				<SearchInput
					placeholder="Cari kategori"
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<FlatList
					data={Category.data.filter(item => item.name_product_category.toLowerCase().includes(search.toLowerCase()))}
					renderItem={({ item, index }) => {
						console.debug(item)
						return <ManagementCategoryCard
							onPressEdit={() => navigation.navigate('/drawer/manajemen/kategori/edit', { item })}
							disabled={index == 0 && item.name_product_category == "Umum"}
							hidden={index == 0 && item.name_product_category == "Umum"}
							name={item.name_product_category}
						/>
					}}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_handleAddNewCategory}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="TAMBAH KATEGORI BARU"
				/>
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