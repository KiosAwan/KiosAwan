import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from '../../../../components/Text/CustomText';
import SearchInput from '../../../../components/Input/SearchInput';
import { GlobalHeader } from '../../../../components/Header/Header';
import { AwanPopup } from '../../../../components/ModalContent/Popups';
import { ColorsList } from '../../../../styles/colors';
import { ProductCard } from '../../../../components/Card/CardComp';
import { convertRupiah } from '../../../../utils/authhelper';
import { Bottom, Button } from '../../../../components/Button/ButtonComp';

const ManajemenProdukAdd = ({ navigation }) => {
	const [search, setSearch] = useState('')
	const [visible, setVisible] = useState(false)

	setTimeout(() => {
		setVisible(false)
	}, 2000)

	return (
		<View style={{ backgroundColor: ColorsList.authBackground, flex: 1 }}>
			<GlobalHeader title="Produk"
				onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 20 }}>
				<SearchInput
					search={search}
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<View style={{ marginTop: 15 }}>
					<ProductCard
						name="Nama Produk"
						price={convertRupiah(5000)}
						stock={50}
						right={
							<TouchableOpacity onPress={() => { }} style={{
								width: '10%',
								height: '100%',
								backgroundColor: ColorsList.greyBg,
								padding: 8,
								justifyContent: 'center',
								alignItems: "center"
							}}>
								<Image style={{ width: 40, height: 40 }} source={require('../../../../assets/icons/edit.png')} />
							</TouchableOpacity>
						}
					/>
				</View>



				<AwanPopup.Loading visible={visible} />
				{/* <Button onPress={() => setVisible(true)}>HJjjjd</Button> */}
			</View>
			<Bottom>
				<Button style={{ width: '100%' }} textProps={{ font: 'Bold' }}>+ TAMBAH PRODUK BARU</Button>
			</Bottom>
		</View>
	);
}

export default ManajemenProdukAdd