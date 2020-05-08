import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Clipboard, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { RowOpposite } from 'src/components/Row/RowComp';
import { getTransactionDetail, convertRupiah, formatToDays } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { SizeList } from 'src/styles/size';
import { RowChild } from 'src/components/Helper/RowChild';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import ViewShot from 'react-native-view-shot';
import Screenshot, { Config } from 'src/utils/screenshot';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { $BorderRadius, $Border, $Padding } from 'src/utils/stylehelper';
import Container, { Body, Footer } from 'src/components/View/Container';
import { CopyButton } from 'src/components/Button/CopyButton';
import { Toast } from 'native-base';
import { stateObject } from 'src/utils/state';
import Divider from 'src/components/Row/Divider';
import TearLines from "react-native-tear-lines";
const TransactionDetail = ({ navigation }) => {
	let viewShotRef
	let bottomLayout
	let topLayout
	const [data, setData] = useState()
	const [back, setBack] = useState()
	const [dataLoading, SetDataLoading] = useState(true)
	const [togglePayment, setTogglePayment, resetTogglePayment] = stateObject()
	const _shareBill = async () => {
		let imgPath = await Screenshot.take(viewShotRef)
		Screenshot.share({ url: imgPath })
	}
	const _canBatal = () => {
		if (data && data.details_item.length > 0) {
			if (data.transaction.status_payment == 3) {
				return false
			}
			else {
				return true
			}
		}
	}
	const _getData = async () => {
		const { transactionId, backState } = await navigation.state.params
		const productData = await getTransactionDetail(transactionId)
		setData(productData.data)
		setBack(backState)
		SetDataLoading(false)
		_backHandler(backState)
	}
	const _backHandler = route => {

	}
	const _renderProductDigital = item => {
		let filterPayment = ["id", "token", "id_transaction", "payment_code", "customerID", "referenceID", "productID", "created_at", "updated_at", "info"]
		let keyDontConvert = ['denda', 'total', 'admin', 'tarif', 'ppj', 'ppn', 'angsuran', 'tagihan', 'adminBank', 'stroom_token', 'materai', 'pembelian_token']
		let viewKey = key => {
			let keys = { ppn: "PPN", ppj: "PPJ" }
			return keys[key] || key.split('_').join(' ').ucwords()
		}
		const { payment } = item
		return <View>
			{
				(payment ? Object.keys(payment).filter(a => !filterPayment.includes(a)) : [])
					.map(key => {
						return <View>
							{
								key != 'description' && [
									<Wrapper spaceBetween style={{ padding: 10 }}>
										<Text>{viewKey(key)}</Text>
										<Text align="right" _width="49%">{!keyDontConvert.includes(key) ? payment[key].trim() : parseInt(payment[key]).convertRupiah()}</Text>
									</Wrapper>,
									<Divider />
								]
							}
							{key == 'description' && <Button color="info" hideIfEmpty disabled noRadius>{typeof payment[key] == 'string' && payment[key].split(';')[0]}</Button>}
						</View>
					})
			}
		</View>
	}
	useEffect(() => {
		_getData()
	}, [])
	return <Container>
		<GlobalHeader title="Detail Transaksi" onPressBack={() => back ? navigation.navigate(back) : navigation.goBack()} />
		<Body>
			<AwanPopup.Loading visible={dataLoading} />
			{
				!dataLoading && <ViewShot ref={ref => viewShotRef = ref} options={Config.viewShotOpt()} style={{ backgroundColor: ColorsList.authBackground }}>
					<TearLines
						ref={ref => topLayout = ref}
						color="#FFFFFF"
						backgroundColor={ColorsList.authBackground}
					/>
					<View
						onLayout={e => {
							topLayout.onLayout(e);
							bottomLayout.onLayout(e);
						}}
						style={{ backgroundColor: ColorsList.whiteColor }}>
						<Text align="center">{data ? data.transaction.name_store : null}</Text>
						<View style={{ ...$BorderRadius(5, 5, 0, 0), marginTop: 10, backgroundColor: ColorsList.whiteColor, padding: 10 }}>
							<Wrapper spaceBetween>
								<Text>Kode Transaksi</Text>
								<Text>{data.transaction.payment_code}</Text>
							</Wrapper>
							<Wrapper spaceBetween>
								<Text>Waktu dan Tanggal</Text>
								<Text>{data.transaction.created_at}</Text>
							</Wrapper>
							<Wrapper spaceBetween>
								<Text>Pembayaran</Text>
								<Text>{data.transaction.id_payment_type == 1 ? "Tunai" : data.transaction.id_payment_type == 2 ? `Non Tunai(${data.transaction.method})` : "Piutang"}</Text>
							</Wrapper>
							<Wrapper spaceBetween>
								<Text>Operator</Text>
								<Text>{data.transaction.cashier}</Text>
							</Wrapper>
							{data.debt ?
								<Wrapper spaceBetween>
									<Text>Pelanggan</Text>
									<Text>{data.transaction.name_customer}</Text>
								</Wrapper>
								: null}
						</View>
						{data.debt ?
							// <View style={{ height: 1, backgroundColor: ColorsList.greyFont, width: '100%' }} />
							<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopColor: ColorsList.greySoft, borderTopWidth: 1 }}>
								<RowOpposite title="Jumlah Hutang" content={convertRupiah(data.debt.total)} />
								<RowOpposite title="Jumlah yang sudah dibayar" content={convertRupiah(data.transaction.amount_payment)} />
								<RowOpposite title="Sisa hutang" content={convertRupiah(data.debt.remaining_debt)} />
								<RowOpposite
									style={data.transaction.status == 0 ? { color: ColorsList.warning } : null}
									title="Jatuh Tempo" content={formatToDays(data.debt.due_debt_date)} />
							</View>
							: null
						}
						<View style={{ backgroundColor: ColorsList.whiteColor, marginBottom: 10, ...$BorderRadius(0, 0, 5, 5) }}>
							<View name="Daftar Produk" style={{ display: data.details_item.length == 0 ? "none" : "flex" }}>
								<View style={{ padding: 10, ...$Border(ColorsList.primary, 1, 0) }}>
									<Text align="center" size={16} color="primary">Daftar Produk</Text>
								</View>
								{
									data.details_item.map((data) => {
										return <Wrapper width="100%" style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
											<View _width="76%">
												<Text color="primary" size={15}>{data.product}</Text>
												<Text>{convertRupiah(data.price)} x {data.qty}</Text>
											</View>
											<View _width="24%" _justify="flex-end">
												<Text align="right">{convertRupiah(data.total)}</Text>
											</View>
										</Wrapper>
									})
								}
							</View>
							<View name="Daftar Produk Digital" style={{ display: data.product_digital.length == 0 ? "none" : "flex" }}>
								<View style={{ padding: 10, ...$Border(ColorsList.primary, 1, 0) }}>
									<Text align="center" size={16} color="primary">Pulsa dan Tagihan</Text>
								</View>
								{
									data.product_digital.map((item, i) => {
										return <View key={i.toString()}>
											<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
												<View>
													<Text color="primary" size={15}>{item.transaction.transaction_name.split('_').join(' ').toUpperCase()}</Text>
													<Text>{item.transaction.customerID}</Text>
													{item.payment && item.payment.nama && <Text>{item.payment.nama}</Text>}
													<Text>{item.transaction.transaction_code}</Text>
												</View>
												<View style={{ alignItems: 'flex-end' }}>
													<Text color={item.transaction.status === "SUCCESS" ? 'success' : (data === "PENDING" ? 'info' : 'danger')}>{item.transaction.status}</Text>
													<Text>{convertRupiah(item.transaction.total)}</Text>
													{/* {item.payment && <Button padding={0} color={["transparent", "primary"]} onPress={() => setTogglePayment({ [item.transaction.transaction_code]: !togglePayment[item.transaction.transaction_code] })}>Details</Button>} */}
												</View>
											</Wrapper>
											{item.transaction.transaction_name == "pln_prepaid" && item.transaction.status == "SUCCESS" && [
												<View>
													<Text style={{ paddingLeft: 10 }} color="primary">Token Listrik</Text>
													<Wrapper style={styles.token} justify="space-between">
														<Text size={15} style={{ paddingLeft: 10 }}>{item.payment.token.match(/.{1,4}/g).join(" ")}</Text>
														<CopyButton onPress={() => {
															Toast.show({ text: "Berhasil disalin", type: "success" })
															Clipboard.setString(item.payment.token)
														}} />
													</Wrapper>
												</View>
											]}
											{_renderProductDigital(item)}
										</View>
									})
								}
							</View>
							<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
								<Text font="Bold">Subtotal</Text>
								<Text font="Bold">{convertRupiah(data.transaction.sub_total)}</Text>
							</Wrapper>
							{
								data.transaction.discount &&
								<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
									<Text font="Bold">Diskon</Text>
									<Text font="Bold">{convertRupiah(data.transaction.discount)}</Text>
								</Wrapper>
							}
							{
								data.transaction.status != 1 &&
								<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
									<Text font="Bold">Pembatalan Transaksi</Text>
									<Text font="Bold">{convertRupiah(data.transaction.total_return)}</Text>
								</Wrapper>
							}
							<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
								<Text font="Bold">Total</Text>
								<Text font="Bold">
									{
										data.transaction.status == 1 ?
											convertRupiah(data.transaction.total_transaction) :
											convertRupiah(data.transaction.remaining_return)
									}
								</Text>
							</Wrapper>
							<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
								<Text font="Bold">Jumlah yang dibayar</Text>
								<Text font="Bold">
									{convertRupiah(data.transaction.amount_payment)}
								</Text>
							</Wrapper>
							<Wrapper style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]} justify="space-between">
								<Text font="Bold">Kembalian</Text>
								<Text font="Bold">
									{convertRupiah(data.transaction.change_payment)}
								</Text>
							</Wrapper>
							{data.transaction.note !== "" &&
								<View style={[$Padding(15, 10), $Border(ColorsList.authBackground, 0, 0, 1)]}>
									<Text align="left" font="Bold">Note</Text>
									<Text align="left">{data.transaction.note}</Text>
								</View>
							}
						</View>
						<View style={{ alignItems: 'center' }}>
							<Text align="center">Powered by</Text>
							<Image style={{ width: 150, height: 70 }} source={require('src/assets/images/logostruk.png')} />
						</View>
					</View>
					<TearLines
						isUnder
						ref={ref => bottomLayout = ref}
						color="#FFFFFF"
						backgroundColor={ColorsList.authBackground}
					/>
				</ViewShot>
			}
		</Body>
		<Footer>
			{
				!dataLoading && data.transaction.status != 3 &&
					data.transaction.status_payment == 2 ?
					<View>
						<Wrapper style={{ marginBottom: 10 }} justify="space-between">
							{_canBatal() && <Button wrapper={{ justify: 'center' }} color="white" _width="54.5%"
								onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })}
							>
								{/* <Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/plus-primary.png')} /> */}
								<Text color="primary">BATALKAN</Text>
							</Button>}
							<Button wrapper={{ justify: 'center' }} color="white" _width={_canBatal() ? "22%" : "49%"} onPress={_shareBill}>
								<Image _style={{ marginRight: 10 }} style={{ height: 20, width: 20 }} source={require('src/assets/icons/share-primary.png')} />
								{!_canBatal() && <Text color="primary">KIRIM STRUK</Text>}
							</Button>
							<Button wrapper={{ justify: 'center' }} color="white" _width={_canBatal() ? "22%" : "49%"} onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { singleData: params, type: false })}>
								<Image _style={{ marginRight: 10 }} style={{ height: 20, width: 20 }} source={require('src/assets/icons/print-primary.png')} />
								{!_canBatal() && <Text color="primary">CETAK STRUK</Text>}
							</Button>
						</Wrapper>
						<Button onPress={async () => {
							navigation.navigate('/drawer/transaction/detail/lunasi', { paramData: data })
						}}>LUNASI</Button>
					</View>
					:
					<View>
						{_canBatal() && <Button onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })} color="white" width='100%'>BATALKAN</Button>}
						<Wrapper style={{ marginTop: 5 }} justify="space-between">
							<Button onPress={_shareBill} _width="49.5%">
								<Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('src/assets/icons/share.png')} />
								<Text style={styles.btnwithIconText}>KIRIM STRUK</Text>
							</Button>
							<Button onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { data: data, type: true })} _width="49.5%">
								<Image style={{ height: 25, width: 25 }} source={require('src/assets/icons/print.png')} />
								<Text style={styles.btnwithIconText}>CETAK STRUK</Text>
							</Button>
						</Wrapper>
					</View>
			}
		</Footer>
	</Container>
}

export default TransactionDetail

const styles = StyleSheet.create({
	wrapIconText: {
		borderRadius: 5,
		...RowChild,
		padding: 8,
		width: (SizeList.width - 50) / 2,
		justifyContent: "center",
		borderRadius: 5,
		backgroundColor: ColorsList.primaryColor
	},
	btnwithIconText: {
		...FontList.titleFont,
		fontSize: 12,
		color: ColorsList.whiteColor,
	},
	token: {
		borderWidth: 1,
		padding: 5,
		marginHorizontal: 10,
		marginBottom: 10,
		borderColor: ColorsList.primary,
		borderRadius: 5
	}
})