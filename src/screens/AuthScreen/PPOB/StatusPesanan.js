import React, { useEffect, useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ColorsList } from 'src/styles/colors';
import { View, Image, StyleSheet, Clipboard, TouchableOpacity } from 'react-native';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Border, $BorderRadius } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { convertRupiah, getUserToken, getUserId, sendNewTransaction } from 'src/utils/authhelper';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { useDispatch, useSelector } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Screenshot from 'src/utils/screenshot';
import { CopyButton } from 'src/components/Button/CopyButton';
import { Toast } from 'native-base';
import { AddCashPayment, AddCustomer, AddDiscountName, AddDiscountPersen, AddDiscountRupiah, removeAllCart } from 'src/redux/actions/actionsStoreProduct';
import { SetIdMultiCart } from 'src/redux/actions/actionsPPOB';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { SizeList } from 'src/styles/size';
import { IconHeader } from 'src/components/Header/Header';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { getProfile } from 'src/redux/actions/actionsUserData';

const StatusPesanan = ({ navigation }) => {
	let viewShotRef;
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)
	const Product = useSelector(state => state.Product)

	const [params, setParams] = useState({
		details: null,
		payment: null,
		transaction: null
	})
	const [loading, setLoading] = useState(false)
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	useEffect(() => {
		if (navigation.state.params.params) {
			setParams(navigation.state.params.params)
		}
	}, [])


	const wrapper = {
		justify: 'space-between',
		style: { padding: 10 }
	}
	const { details, payment, transaction } = params

	const _checkData = (key, isCondition) => {
		let data = transaction ? transaction[key] : ''
		return isCondition ? Boolean(data) : data
	}

	const _shareBill = async () => {
		let imgPath = await Screenshot.take(viewShotRef)
		Screenshot.share({ url: imgPath })
	}

	const _renderProductDigital = item => {
		let filterPayment = ["id", "status", "token", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "updated_at", "info", "supplier", "tgl_registrasi", "product_code"]
		let keyDontConvert = ['total', 'admin', 'tagihan1', 'tagihan2', 'tagihan3', 'ppj', 'ppn', 'angsuran', 'tagihan', 'adminBank', 'denda', 'stroom_token', 'pembelian_token', 'materai']
		let viewKey = key => {
			let keys = { ppn: "PPN", ppj: "PPJ", created_at: "Tanggal transaksi", Jmltagihan: "Jumlah Tagihan", adminBank: "Admin Bank" }
			return keys[key] || key.split('_').join(' ').ucwords()
		}
		return <View>
			{
				(payment ? Object.keys(payment).filter(a => !filterPayment.includes(a)) : [])
					.rMap(key => {
						if (key == 'tarif')
							console.debug(key, payment[key], payment[key].convertRupiah())
						return key != 'description' ? <View>
							<Wrapper spaceBetween style={{ padding: SizeList.base }}>
								<Text>{viewKey(key)}</Text>
								<Text align="right" _width="49%">{!keyDontConvert.includes(key) ? payment[key].trim() : payment[key].convertRupiah()}</Text>
							</Wrapper>
						</View> : <Button style={{ borderRadius: SizeList.borderRadius }} color="info" hideIfEmpty disabled><Text color="informationFont" align="center">{payment[key].split(';')[0]}</Text></Button>
					})
			}
		</View>
	}
	const _renderPendingProductDigital = () => {
		let filterPayment = ["id", "status", "margin", "cash_back", "productID", "customerID", "customer_name", "id_multi_transaction", "admin_original", "id_user", "total_original", "status", "productID", "transaction_name", "date", "id_transaction", "info", "supplier", "tgl_registrasi", "product_code"]
		let viewKey = key => {
			let keys = { ppn: "PPN", ppj: "PPJ", created_at: "Tanggal transaksi", adminBank: "Admin Bank" }
			return keys[key] || key.split('_').join(' ').ucwords()
		}
		return <View>
			{
				(transaction ? Object.keys(transaction).filter(a => !filterPayment.includes(a)) : [])
					.rMap(item => <View>
						<Wrapper spaceBetween style={{ padding: 10 }}>
							<Text>{viewKey(item)}</Text>
							<Text align="right" _width="49%">{
								!['total',
									'tagihan1', 'tagihan2', 'tagihan3',
									'admin',
									'ppj',
									'ppn',
									'angsuran',
									'tagihan',
									'adminBank',
									"denda"
								].includes(item) ? transaction[item].trim() :
									parseInt(transaction[item]).convertRupiah()}</Text>
						</Wrapper>
					</View>
					)
			}
		</View>
	}

	const _onPressSelesai = async () => {
		const userToken = await getUserToken()
		dispatch(getProfile(User.data.id, userToken))
		if (Product.jumlahitem == 1) {
			_handlePayCash()
		} else {
			dispatch(getCustomer(User.store.id_store, userToken))
			navigation.navigate('/cashier/check-out')
		}
	}

	const _handlePayCash = async () => {
		setLoading(true)
		const userToken = await getUserToken()
		const userId = await getUserId()
		let cart = []
		const data = {
			cashier: userId,
			amount_payment: Product.total - Product.total_diskon,
			id_payment_type: 1,
			payment_method: "",
			product_cart: cart,
			customer: null,
			id_store: User.store.id_store,
			discount_name: '',
			discount_transaction: Product.discount_transaction,
			note: Product.note,
			id_multi: Product.id_multi
		}
		const res = await sendNewTransaction(data)
		setLoading(false)
		if (res.status == 400) {
			setAlertMessage(res.data.errors.msg)
			setAlert(true)
		} else if (res.status == 200) {
			dispatch(getTransactionList(User.store.id_store, userToken))
			dispatch(removeAllCart())
			dispatch(AddCashPayment(0))
			dispatch(AddCustomer(null))
			dispatch(AddDiscountName(''))
			dispatch(AddDiscountPersen(''))
			dispatch(AddDiscountRupiah(''))
			dispatch(SetIdMultiCart(0))
			navigation.navigate('/ppob')
		} else {
			alert(JSON.stringify(res))
		}
	}
	return <Container header={{
		title: 'Status Pesanan',
		renderLeftAccessory: () => <View style={{ width: 60 }} />,
		renderRightAccessory: () => <Wrapper spaceBetween style={{ width: 60 }}>
			<TouchableOpacity onPress={_shareBill}>
				<IconHeader name="share-alt" color={ColorsList.greyFont} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { singleData: params, type: false })}>
				<IconHeader name="print" color={ColorsList.greyFont} />
			</TouchableOpacity>
		</Wrapper>
	}}>
		<AwanPopup.Loading visible={loading} />
		<AwanPopup.Alert
			message={alertMessage}
			visible={alert}
			closeAlert={() => setAlert(false)}
		/>
		<Body>
			<ViewShot style={{ backgroundColor: ColorsList.authBackground }} ref={ref => viewShotRef = ref}>
				{
					_checkData('status') === 'PENDING' ?
						<Button style={{ borderRadius: SizeList.borderRadius }} disabled color="warning" wrapper={{ justify: 'flex-start' }}>
							<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
							<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi sedang diproses!</Text>
						</Button>
						:
						<Button style={{ borderRadius: SizeList.borderRadius }} disabled color="success" wrapper={{ justify: 'flex-start' }}>
							<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
							<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi berhasil!</Text>
						</Button>
				}
				<View style={{ backgroundColor: ColorsList.whiteColor, borderRadius: SizeList.borderRadius, marginTop: SizeList.base, padding: SizeList.padding }}>
					<View style={{ marginVertical: SizeList.base }}>
						<Text align="center" size={16} font="SemiBold">
							{User.store.name_store}
						</Text>
						<View style={{ ...$BorderRadius(5, 5, 0, 0), marginTop: 10, backgroundColor: ColorsList.whiteColor, padding: 10 }}>
							<Wrapper spaceBetween>
								<Text>Kode Transaksi</Text>
								<Text>{transaction && transaction.transaction_code}</Text>
							</Wrapper>
							<Wrapper spaceBetween>
								<Text>Waktu dan Tanggal</Text>
								<Text>{transaction && transaction.date}</Text>
							</Wrapper>
							<Wrapper spaceBetween>
								<Text>Operator</Text>
								<Text>{User.data.name}</Text>
							</Wrapper>
						</View>
					</View>
					<Divider />
					<Wrapper {...wrapper}>
						<View>
							<Text color="primary" size={16}>{_checkData('transaction_name').split('_').join(' ').toUpperCase()}</Text>
							<Text>{_checkData('customerID')}</Text>
						</View>
						{

							transaction && transaction.tagihan == 0 ?
								<View /> :
								<Text>{convertRupiah(parseInt(_checkData('total')))}</Text>
						}
					</Wrapper>
					<Divider />
					{transaction && transaction.transaction_name == "pln_prepaid" && payment && payment.token && [
						<View>
							<Wrapper style={{ paddingVertical: SizeList.base }} justify="space-between">
								<Text style={{ paddingLeft: 10 }}>{payment.token.match(/.{1,4}/g).join("-")}</Text>
								<CopyButton onPress={() => {
									Toast.show({ text: "Berhasil disalin", type: "success" })
									Clipboard.setString(payment.token)
								}} />
							</Wrapper>
						</View>
					]}
					{payment ? _renderProductDigital() : _renderPendingProductDigital()}
					<Divider />
					<View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center" }}>
						<Text size={12} align="center">Powered by</Text>
						<Image style={{ width: 100, height: 70, resizeMode: "contain" }} source={require('src/assets/images/logostruk.png')} />
					</View>
				</View>
			</ViewShot>
		</Body>
		<Footer>
			<Wrapper>
				<Button noBorder wrapper={{ justify: 'center' }} color="link" _width="49%" onPress={async () => {
					const userToken = await getUserToken()
					dispatch(getProfile(User.data.id, userToken))
					navigation.navigate('/ppob')
				}}>
					<Text color="primary">TAMBAH PRODUK</Text>
				</Button>
				<Button _width="49%" onPress={_onPressSelesai}>SELESAI</Button>
			</Wrapper>
		</Footer>
	</Container>
}
export default StatusPesanan

const styles = StyleSheet.create({
	token: {
		borderWidth: 1,
		padding: 5,
		marginHorizontal: 10,
		marginBottom: 10,
		borderColor: ColorsList.primary,
		borderRadius: 5
	}
})