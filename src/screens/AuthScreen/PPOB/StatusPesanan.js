import React, { useEffect, useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ColorsList } from 'src/styles/colors';
import { View, Image, StyleSheet, Clipboard } from 'react-native';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Border } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { convertRupiah } from 'src/utils/authhelper';
import moment from 'moment';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { useDispatch, useSelector } from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Screenshot from 'src/utils/screenshot';
import { CopyButton } from 'src/components/Button/CopyButton';
import { Toast } from 'native-base';

const StatusPesanan = ({ navigation }) => {
	let viewShotRef;
	const dispatch = useDispatch()
	const User = useSelector(state => state.User)

	const [params, setParams] = useState({
		details: null,
		payment: null,
		transaction: null
	})

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
		let filterPayment = ["id", "status", "token", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "created_at", "updated_at", "info"]
		return <View>
			{
				(payment ? Object.keys(payment).filter(a => !filterPayment.includes(a)) : [])
					.map(
						item => item != 'description' ? <View>
							<Wrapper spaceBetween style={{ padding: 10 }}>
								<Text>{item.split('_').join(' ').ucwords()}</Text>
								<Text align="right" _width="49%">{![
									'total',
									'admin',
									'tarif',
									'ppj',
									'ppn',
									'angsuran',
									'tagihan',
									'adminBank',
									'denda',
									'stroom_token',
									'pembelian_token',
									'materai'
								].includes(item) ? payment[item].trim() : parseInt(payment[item]).convertRupiah()}</Text>
							</Wrapper>
							<Divider />
						</View> : <Button color="info" hideIfEmpty disabled>{payment[item].split(';')[0]}</Button>
					)
			}
		</View>
	}
	const _renderPendingProductDigital = () => {
		let filterPayment = ["status", "margin", "cash_back", "productID", "customerID", "customer_name", "id_multi_transaction", "admin_original", "id_user", "admin", "total_original", "status", "productID", "transaction_name", "date", "id_transaction", "info", "date"]
		return <View>
			{
				(transaction ? Object.keys(transaction).filter(a => !filterPayment.includes(a)) : [])
					.map(item => <View>
						<Wrapper spaceBetween style={{ padding: 10 }}>
							<Text>{item.split('_').join(' ').ucwords()}</Text>
							<Text align="right" _width="49%">{
								!['total',
									'admin',
									'tarif',
									'ppj',
									'ppn',
									'angsuran',
									'tagihan',
									'adminBank',
									"denda"
								].includes(item) ? transaction[item].trim() :
									parseInt(transaction[item]).convertRupiah()}</Text>
						</Wrapper>
						<Divider />
					</View>
					)
			}
		</View>
	}
	return <Container header={{ title: 'Status Pesanan' }}>
		<Body>
			<ViewShot style={{ backgroundColor: ColorsList.authBackground }} ref={ref => viewShotRef = ref}>
				{
					_checkData('status') === 'PENDING' ?
						<Button disabled color="warning" wrapper={{ justify: 'flex-start' }}>
							<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
							<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi sedang diproses!</Text>
						</Button>
						:
						<Button disabled color="success" wrapper={{ justify: 'flex-start' }}>
							<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
							<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi berhasil!</Text>
						</Button>
				}
				<View style={{ backgroundColor: ColorsList.whiteColor, borderRadius: 5, marginTop: 15 }}>
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
					{transaction && transaction.transaction_name == "pln_prepaid" && payment && payment.token && [
						<Wrapper style={styles.token} justify="space-between">
							<Text style={{ paddingLeft: 10 }}>{payment.token.match(/.{1,4}/g).join(" ")}</Text>
							<CopyButton onPress={() => {
								Toast.show({ text: "Berhasil disalin", type: "success" })
								Clipboard.setString(payment.token)
							}} />
						</Wrapper>,
					]}
					<Divider />
					{payment ? _renderProductDigital() : _renderPendingProductDigital()}
				</View>
			</ViewShot>
		</Body>
		<Footer>
			<Wrapper style={{ marginBottom: 10 }} justify="space-between">
				<Button wrapper={{ justify: 'center' }} color="white" _width="54.5%" onPress={() => navigation.navigate('/ppob')}>
					<Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/plus-primary.png')} />
					<Text color="primary">TAMBAH PRODUK</Text>
				</Button>
				<Button wrapper={{ justify: 'center' }} color="white" _width="22%" onPress={_shareBill}>
					<Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/share-primary.png')} />
					{/* <Text color="primary">CETAK STRUK</Text> */}
				</Button>
				<Button wrapper={{ justify: 'center' }} color="white" _width="22%" onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { singleData: params, type: false })}>
					<Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/print-primary.png')} />
					{/* <Text color="primary">CETAK STRUK</Text> */}
				</Button>
			</Wrapper>
			<Button onPress={() => {
				navigation.navigate('/cashier/check-out')
				dispatch(getCustomer(User.store.id_store))
			}}>SELESAI</Button>
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