import React, { useEffect, useState } from 'react';
import { View, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { WrapperItem } from 'src/components/Picker/SelectBoxModal';
import { FontList } from 'src/styles/typography';
import { ColorsList } from 'src/styles/colors';
import { convertRupiah, cancelTransaction, getUserToken } from 'src/utils/authhelper';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { ReturnTransactionCard } from 'src/components/Card/CardComp';
import { } from 'src/components/Input/InputComp';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import AsyncStorage from '@react-native-community/async-storage';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import MDInput, { Input } from 'src/components/Input/MDInput';

const TransactionDetailBatalkan = ({ navigation }) => {
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const [dataTransaksi, setDataTransaksi] = useState()
	const [loading, setLoading] = useState(true)
	const [detailItem, setDetailItem] = useState(false)
	const [alertVisible, setAlertVisible] = useState(false)
	const [errorMessage, setErrorMessage] = useState(false)
	const [errorAlert, setErrorAlert] = useState(false)
	const [newData, setNewData] = useState()
	const [alasan, setAlasan] = useState('')
	const [amount_cancel, setAmountCancel] = useState(0)
	useEffect(() => {
		_getParams()
	}, [])

	const _getParams = async () => {
		const { paramData } = await navigation.state.params
		setDataTransaksi(paramData)
		if (paramData.transaction.status == 2) {
			paramData.return_item.forEach(a => {
				a.newQty = a.qty
			})
			// setAmountCancel(paramData.transaction.remaining_return)
			setNewData(paramData.return_item)
		} else {
			paramData.details_item.forEach(a => {
				a.newQty = a.qty
			})
			// setAmountCancel(paramData.transaction.total_transaction)
			setNewData(paramData.details_item)
		}
		setLoading(false)
	}

	const _handlePlusItem = (barang) => {
		let a = newData.find(item => item.id == barang.id)
		if (a.newQty != a.qty) {
			let newTotal = parseInt(amount_cancel) - parseInt(a.price)
			setAmountCancel(newTotal)
			a.newQty++
			setNewData([...newData])
		}
	}

	const _handleMinusItem = (barang) => {
		const a = newData.find(item => item.id == barang.id)
		if (a.newQty !== 0) {
			let newTotal = parseInt(amount_cancel) + parseInt(a.price)
			setAmountCancel(newTotal)
			a.newQty--
			setNewData([...newData])
		}
	}

	const _handleCancelTransaction = async () => {
		setAlertVisible(false)
		const userToken = await getUserToken()
		const userId = await AsyncStorage.getItem('userId')
		let product_cart = []
		newData.rMap(item => {
			product_cart.push({ qty_in: item.qty - item.newQty })
		})
		const data = {
			id_transaction: dataTransaksi.transaction.id_transaction,
			cashier: userId,
			product_cart: newData,
			reason_return: alasan,
			product_cart
		}
		const res = await cancelTransaction(data)
		if (res.status == 200) {
			dispatch(getTransactionList(User.store.id_store, userToken))
			navigation.navigate('Transaksi')
		} else if (res.status == 400) {
			setErrorMessage(res.data.errors.msg)
			setErrorAlert(true)
		}
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<AwanPopup.Title title="Batalkan Transaksi" visible={alertVisible} message={`Dana sebesar ${convertRupiah(amount_cancel)} akan dikembalikan kepada pelanggan.`}>
				<View></View>
				<Button onPress={() => setAlertVisible(false)} style={{ width: '25%' }} color="link">Batal</Button>
				<Button onPress={_handleCancelTransaction} style={{ width: '25%' }}>Ya</Button>
			</AwanPopup.Title>
			<AwanPopup.Alert
				message={errorMessage}
				visible={errorAlert}
				closeAlert={() => setErrorAlert(false)}
			/>
			<GlobalHeader title="Batalkan Transaksi"
				onPressBack={() => navigation.goBack()}
			/>
			<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, padding: 20, backgroundColor: ColorsList.authBackground }}>
				{loading ? <Text>Loading</Text> :
					<View>
						<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Total yang dibatalkan</Text>
							<WrapperItem style={{ paddingBottom: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
								<Text color="primaryColor" size={24}>{convertRupiah(dataTransaksi.transaction.status == 1 ? parseInt(amount_cancel) : amount_cancel)}</Text>
							]} right={
								<Text onPress={() => setDetailItem(!detailItem)} size={16}>DETAIL</Text>
							} />
							{detailItem ? dataTransaksi.details_item.rMap((data, i) => {
								return (
									<WrapperItem key={i} style={{ paddingBottom: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.product}</Text>,
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price)} x {data.qty}</Text>
									]} right={[
										<Text></Text>,
										<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price * data.qty)}</Text>
									]} />
								)
							}) : null}

							{detailItem ?
								<View>
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text>Subtotal</Text>,
									]} right={
										<Text>{convertRupiah(dataTransaksi.transaction.sub_total)}</Text>
									} />
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text>Pembatalan transaksi</Text>,
									]} right={
										<Text color="danger">- {convertRupiah(amount_cancel)}</Text>
									} />
								</View>
								: null}
						</View>
						<View style={{ alignItems: "center", paddingBottom: 10 }}>
							<Text>Pilih produk yang akan dibatalkan</Text>
						</View>
						<FlatList
							data={newData}
							renderItem={({ item }) => (
								<ReturnTransactionCard
									name={item.product}
									price={convertRupiah(item.price)}
									onPressMinus={() => _handleMinusItem(item)}
									minusDisabled={dataTransaksi.transaction.discount ? true : false}
									onPressPlus={() => _handlePlusItem(item)}
									plusDisabled={dataTransaksi.transaction.discount ? true : false}
									quantity={item.newQty ? item.newQty : null}
								/>
							)}
							showsVerticalScrollIndicator={false}
							keyExtractor={(item, index) => index.toString()}
						/>
						<View style={{ marginBottom: 90 }}>
							<Input label="Alasan pembatalan"
								value={alasan}
								onChangeText={text => setAlasan(text)}
							/>
						</View>
					</View>
				}
			</ScrollView>
			<Bottom justify="space-between">
				<Button width="100%" onPress={() => {
					if(amount_cancel !== 0){
					setAlertVisible(true)
					}else {
						setErrorMessage("Anda belum memilih barang untuk dikembalikan")
						setErrorAlert(true)
					}
					}}>BATALKAN</Button>
			</Bottom>
		</View>
	)
}

export default TransactionDetailBatalkan