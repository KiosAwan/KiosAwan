import React, { useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { AddCart, MinusQuantity, AddQuantity } from '../../redux/actions/actionsStoreProduct';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { GlobalHeader } from '../../components/Header/Header';
import { WrapperItem, PilihPelanggan, PopupDetailPesanan } from '../../components/Picker/SelectBoxModal';
import { Icon, Item } from 'native-base';
import { FloatingInputLabel } from '../../components/Input/InputComp';
const height = Dimensions.get('window').height
const Cart = ({ navigation }) => {
	const dispatch = useDispatch()
	const Product = useSelector(state => state.Product)
	const User = useSelector(state => state.User)
	const [pilihPelangganOpen, setPilihPelangganOpen] = useState(false)
	const [editPesananOpen, setEditPesananOpen] = useState(false)
	const _handleNextBtn = async () => {
		await dispatch(getCustomer(User.store.id_store))
		navigation.navigate('CheckOut')
	}
	const _editPesanan = (index, pesanan) => {
		console.log(index, pesanan)
		setEditPesananOpen(true);
	}
	return (
		<View style={{ backgroundColor: ColorsList.authBackground, flex: 1 }}>

			<PilihPelanggan action={(action, pelanggan)=>{
				console.log(action, pelanggan)
			}} visible={pilihPelangganOpen} data={[{ nama: 'Udin', notelp: '085717570370' }, { nama: 'Adun', notelp: '085717570370' }]} dismiss={() => setPilihPelangganOpen(false)} />
			<PopupDetailPesanan visible={editPesananOpen} dismiss={() => setEditPesananOpen(false)} />
			<GlobalHeader title="Detail Pesanan" onPressBack={() => navigation.goBack()} />
			<View style={{ padding: 15 }}>
				<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
					{
						Product.belanja.map((data, i) => {
							return (
								<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
									<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.name_product}</Text>,
									<Text style={{ color: ColorsList.greyFont }}>Rp. {data.price_out_product} x {data.quantity}</Text>
								]} right={[
									<Icon onPress={() => _editPesanan(i, data)} style={{ color: ColorsList.primaryColor }} name="create" />,
									<Text style={{ color: ColorsList.greyFont }}>Rp. {data.price_out_product * data.quantity}</Text>
								]} />
							)
						})
					}
					<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
						<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Subtotal</Text>,
					]} right={
						<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Rp. 50.000</Text>
					} />
					<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
						<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Total</Text>,
					]} right={
						<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Rp. 70.000</Text>
					} />
				</View>
				<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
					<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
						<Item style={{ borderColor: 'transparent' }}>
							<Icon style={{ color: ColorsList.primaryColor }} name="contact" />
							<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Pilih Pelanggan</Text>
						</Item>
					]} right={
						<Icon onPress={() => setPilihPelangganOpen(true)} style={{ color: ColorsList.primaryColor }} name="add" />
					} />
				</View>
				<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
					<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
						<Text style={{ color: ColorsList.greyFont, fontWeight: 'bold', fontSize: 17.5 }}>Berikan Diskon</Text>
					]} right={
						<Icon style={{ color: ColorsList.primaryColor }} name="add-circle" />
					} />
				</View>
				<View style={[{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }, { padding: 10, paddingHorizontal: 15 }]}>
					<FloatingInputLabel label="Catatan Pembelian" placeholder="Masukkan catatan pembelian disini" />
				</View>
			</View>

			{/* <View style={{ backgroundColor: ColorsList.authBackground, padding: 20, height }}>
				<Text>Total belanja : {convertRupiah(Product.total)}</Text>
				<Text>Total item : {Product.jumlahitem}</Text>
				{
					Product.belanja.length > 0 ?
						<FlatList
							data={Product.belanja}
							renderItem={({ item }) => (
								<ProductCard
									name={item.name_product}
									price={convertRupiah(item.price_out_product)}
									onPressMinus={() => dispatch(MinusQuantity(item))}
									onPressPlus={() => dispatch(AddQuantity(item))}
									plusDisabled={item.manage_stock == 1 ? item.quantity < item.stock ? false : true : false}
									quantity={item.quantity ? item.quantity : null}
								/>
							)}
							keyExtractor={(item, index) => index.toString()}
						/> :
						<Text>Anda belum mempunyai barang di keranjang</Text>
				}
				<RegisterButton
					buttonTitle="Lanjut ke pembayaran"
					onPressBtn={_handleNextBtn}
					disabled={Product.belanja.length > 0 ? false : true}
				/>

			</View> */}
		</View>
	);
}

export default Cart