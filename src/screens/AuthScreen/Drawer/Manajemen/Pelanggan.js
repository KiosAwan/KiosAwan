import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader, IconHeader } from 'src/components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import SearchInput from 'src/components/Input/SearchInput';
import { ManagementPelangganCard } from 'src/components/Card/ManagementCard';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { getUserToken } from 'src/utils/authhelper';
import Container, { Footer, Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';

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
		<Container>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Pelanggan"
				renderRightAccessory={() =>
					<View style={{width: 60,alignItems : "flex-end" }}>
						<IconHeader onPress={() => ctrl.setVisible(true)} name="search" />
					</View>
				}
			/>
			<Body>
				{/* <SearchInput
					placeholder="Cari pelanggan"
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/> */}
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
			</Body>
			<Footer>
				<Button onPress={_handleAddNewCategory}>
					TAMBAH PELANGGAN BARU
				</Button>
			</Footer>
		</Container>
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