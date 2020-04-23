import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import { GlobalHeader } from '../../../../components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import SearchInput from '../../../../components/Input/SearchInput';
import { ManagementPelangganCard } from '../../../../components/Card/ManagementCard';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { getCustomer } from '../../../../redux/actions/actionsCustomer';
import { getUserToken } from 'src/utils/authhelper';

const ManajemenPelanggan = ({ navigation }) => {

	const dispatch = useDispatch()

	const Customer = useSelector(state => state.Customer)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	useEffect(() => {
		_effect()
	}, [])

	const _effect = async () => {
		const userToken = await getUserToken()
		dispatch(getCustomer(User.store.id_store, userToken))
	}
	const _handleAddNewCategory = () => {
		navigation.navigate('/drawer/manajemen/pelanggan/add')
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Pelanggan"
			/>
			<View style={{ padding: 20, flex: 1 }}>
				<SearchInput
					placeholder="Cari pelanggan"
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<FlatList
					data={Customer.data.filter(item => item.name_customer.toLowerCase().includes(search.toLowerCase()))}
					renderItem={({ item, index }) => (
						<View>
							<ManagementPelangganCard
								onPressEdit={() => navigation.navigate('/drawer/manajemen/pelanggan/edit', { item })}
								name={item.name_customer}
								subName={item.phone_number_customer}
							/>
						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_handleAddNewCategory}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="TAMBAH PELANGGAN BARU"
				/>
			</View>
		</View>
	);
}

export default ManajemenPelanggan

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