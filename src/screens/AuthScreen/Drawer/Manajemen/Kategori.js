import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader, IconHeader, SearchHeader } from 'src/components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import SearchInput from 'src/components/Input/SearchInput';
import { ManagementCategoryCard } from 'src/components/Card/ManagementCard';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { getUserToken } from 'src/utils/authhelper';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';

const ManajemenKategori = ({ navigation }) => {

	const dispatch = useDispatch()

	const Category = useSelector(state => state.Category)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	useEffect(() => {
		_effect()
	}, [])

	const _effect = async () => {
		const userToken = await getUserToken()
		dispatch(getCategory(User.store.id_store, userToken))
	}

	const _handleAddNewCategory = () => {
		navigation.navigate('/drawer/manajemen/kategori/add')
	}
	return (
		<Container>
			<SearchHeader
				onPressBack={() => navigation.goBack()}
				onChangeText={txt => setSearch(txt)}
				onPressIcon={() => setSearch('')}
				search={search}
				label="CARI KATEGORI"
				title="KATEGORI"
			/>
			<Body>
				<FlatList
					data={Category.data.filter(item => item.name_product_category.toLowerCase().includes(search.toLowerCase()))}
					renderItem={({ item, index }) => {
						return <ManagementCategoryCard
							onPressEdit={() => navigation.navigate('/drawer/manajemen/kategori/edit', { item })}
							disabled={index == 0 && item.name_product_category == "Umum"}
							hidden={index == 0 && item.name_product_category == "Umum"}
							name={item.name_product_category}
						/>
					}}
					keyExtractor={(item, index) => index.toString()}
				/>
			</Body>
			<Footer>
				<Button onPress={_handleAddNewCategory}>
					TAMBAH KATEGORI BARU
				</Button>
			</Footer>
		</Container>
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