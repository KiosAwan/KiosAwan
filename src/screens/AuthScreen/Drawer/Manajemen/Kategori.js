import React, { useState, useEffect} from 'react';
import { View, FlatList } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import { GlobalHeader } from '../../../../components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';

const ManajemenKategori = ({ navigation }) => {

	const dispatch = useDispatch()

	const Category = useSelector(state => state.Category)
	const User = useSelector(state => state.User)
	useEffect(() => {
		dispatch(getCategory(User.store.id_store))
	}, [])
	
	return (
		<View style={{flex : 1}}>
			<GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Kategori"
            />
			<FlatList
			data={Category.data}
			renderItem={({item}) => (
				<View>
					<Text>{item.name_product_category}</Text>
				</View>
			)}
			/>
			<Text>Kategori</Text>
		</View>
	);
}

export default ManajemenKategori