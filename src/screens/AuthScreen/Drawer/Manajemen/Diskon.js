import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import { GlobalHeader } from '../../../../components/Header/Header';

import { useSelector, useDispatch } from 'react-redux'
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import SearchInput from '../../../../components/Input/SearchInput';
import { ManagementPelangganCard } from '../../../../components/Card/ManagementCard';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { getDiscount } from '../../../../redux/actions/actionsDiscount';
import { convertRupiah } from '../../../../utils/authhelper';

const ManajemenDiskon = ({ navigation }) => {

	const dispatch = useDispatch()

	const Discount = useSelector(state => state.Discount)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	useEffect(() => {
		dispatch(getDiscount(User.store.id_store))
	}, [])

	const _handleAddNewDiskon = () => {
		navigation.navigate('/drawer/manajemen/diskon/add')
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Diskon"
			/>
			<View style={{ padding: 20, flex: 1 }}>
				<SearchInput
					placeholder="Cari diskon"
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<FlatList
					data={Discount.data.filter(item => item.name_discount.toLowerCase().includes(search.toLowerCase()))}
					renderItem={({ item, index }) => (
						<View>
							<ManagementPelangganCard
								onPressEdit={() => navigation.navigate('/drawer/manajemen/diskon/edit', {item})}
								name={`Potongan Harga ${item.discount_type == 1 ? item.value*100 + ' %' : convertRupiah(item.value) }`}
								subName={item.name_discount}
							/>
						</View>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</View>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_handleAddNewDiskon}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
					buttonTitle="TAMBAH DISKON BARU"
				/>
			</View>
		</View>
	);
}

export default ManajemenDiskon

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