import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image } from 'react-native'
import SearchInput from '../../../../components/Input/SearchInput';
import { GlobalHeader } from '../../../../components/Header/Header';
import { AwanPopup } from '../../../../components/ModalContent/Popups';
import { ColorsList } from '../../../../styles/colors';
import { ProductCard } from '../../../../components/Card/CardComp';
import { convertRupiah } from '../../../../utils/authhelper';
import { Bottom, Button } from '../../../../components/Button/ButtonComp';
import { useDispatch, useSelector } from 'react-redux';
import { setFromManajemenProduct } from '../../../../redux/actions/actionsNewProduct';
import { getProduct } from 'src/redux/actions/actionsStoreProduct';
import { editProductName, editProductBarcode,editProductAddId, editProductImage, editProductPriceIn, editProductPriceOut, editProductIdCategory, editProductManageStock, editProductSendNotif, editQuantityStock, editMinQtyStock } from 'src/redux/actions/actionsEditProduct';

const ManajemenProduk = ({ navigation }) => {
	const dispatch = useDispatch()

	const Product = useSelector(state => state.Product)
	const User = useSelector(state => state.User)

	const [search, setSearch] = useState('')
	const [visible, setVisible] = useState(false)

	setTimeout(() => {
		setVisible(false)
	}, 2000)

	useEffect(() => {
		dispatch(getProduct(User.store.id_store))
	}, [])

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
					{
						Product.data.map((data, i) => {
							return <ProductCard key={i}
								name={data.name_product}
								price={convertRupiah(data.price_out_product)}
								stock={Number(data.stock) ? data.stock : null}
								right={
									<TouchableOpacity onPress={() => {
										dispatch(editProductName(data.name_product))
										dispatch(editProductBarcode(data.barcode_product))
										dispatch(editProductAddId(data.id_product))
										dispatch(editProductImage(data.photo_product))
										dispatch(editProductPriceIn(data.price_in_product))
										dispatch(editQuantityStock(data.stock))
										dispatch(editMinQtyStock(data.min_stock))
										dispatch(editProductPriceOut(data.price_out_product))
										dispatch(editProductIdCategory(data.id_product_category))
										dispatch(editProductManageStock(data.manage_stock))
										dispatch(editProductSendNotif(data.notif))
										dispatch(editProductBarcode(data.barcode_product))
										navigation.navigate('/drawer/manajemen/produk/edit')					
									}} style={{
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
						})
					}
				</View>
				<AwanPopup.Loading visible={visible} />
				{/* <Button onPress={() => setVisible(true)}>HJjjjd</Button> */}
			</View>
			<Bottom>
				<Button onPress={() => {
					dispatch(setFromManajemenProduct({
						back: '/drawer/manajemen/produk'
					}))
					navigation.navigate('/cashier/new-barcode')
				}} style={{ width: '100%' }} textProps={{ font: 'Bold' }}>+ TAMBAH PRODUK BARU</Button>
			</Bottom>
		</View>
	);
}

export default ManajemenProduk