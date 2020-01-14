import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image,ScrollView } from 'react-native'
import SearchInput from '../../../../components/Input/SearchInput';
import { GlobalHeader } from '../../../../components/Header/Header';
import { AwanPopup } from '../../../../components/ModalContent/Popups';
import { ColorsList } from '../../../../styles/colors';
import { ProductCard } from '../../../../components/Card/CardComp';
import { convertRupiah } from '../../../../utils/authhelper';
import { useDispatch, useSelector } from 'react-redux';
import { setFromManajemenProduct } from '../../../../redux/actions/actionsNewProduct';
import { getProduct } from 'src/redux/actions/actionsStoreProduct';
import { editProductName, editProductBarcode, editProductAddId, editProductImage, editProductPriceIn, editProductPriceOut, editProductIdCategory, editProductManageStock, editProductSendNotif, editQuantityStock, editMinQtyStock, editTempImage } from 'src/redux/actions/actionsEditProduct';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';

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
					placeholder="Cari produk"
					handleChangeInput={(text) => setSearch(text)}
					handleDeleteSearch={() => setSearch('')}
				/>
				<ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 15 }}>
					{
						Product.data.filter(item => item.name_product.toLowerCase().includes(search.toLowerCase())).map((data, i) => {
							return <ProductCard key={i}
								productImage={data.photo_product !== "" ? data.photo_product : null}
								name={data.name_product.toUpperCase()}
								price={convertRupiah(data.price_out_product)}
								stock={data.manage_stock == 1 ? data.stock : null}
								right={
									<TouchableOpacity onPress={() => {
										dispatch(editProductName(data.name_product))
										dispatch(editProductBarcode(data.barcode_product))
										dispatch(editProductAddId(data.id_product))
										dispatch(editProductImage(data.photo_product))
										dispatch(editTempImage(data.photo_product))
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
				</ScrollView>
				<AwanPopup.Loading visible={visible} />
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