import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Clipboard, FlatList, TouchableOpacity } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader, IconHeader } from 'src/components/Header/Header';
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
import { StackActions, NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/FontAwesome5'

const InfoWrapper = props => <Wrapper spaceBetween style={{ marginBottom: SizeList.secondary }} {...props} />

const TransactionDetail = ({ navigation }) => {
	let viewShotRef
	let bottomLayout
	let topLayout
	const [data, setData] = useState()
	const [back, setBack] = useState()
	const [dataLoading, SetDataLoading] = useState(true)
	const [fromCashier, setFromCashier] = useState(false)
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
		const { transactionId, backState, fromCashier } = navigation.state.params
		const productData = await getTransactionDetail(transactionId)
		setData(productData.data)
		if (fromCashier) setFromCashier(true)
		setBack(backState)
		SetDataLoading(false)
		_backHandler(backState)
	}
	const _backHandler = route => {

	}
	const _navigateFromCheckout = () => {
		navigation.dispatch(
			StackActions.reset({
				index: 1,
				key: null,
				actions: [
					NavigationActions.navigate({ routeName: '/' }),
					NavigationActions.navigate({ routeName: '/cashier' }),
				]
			})
		)
	}
	useEffect(() => {
		_getData()
	}, [])
	return <Container header={{
		title: "Struk Belanja",
		renderLeftAccessory: fromCashier ? () => <View style={{ width: 60 }} /> : undefined,
		onPressBack: () => fromCashier ? null : back ? navigation.navigate(back) : navigation.goBack(),
		renderRightAccessory: () => <Wrapper spaceBetween style={{ width: 50 }}>
			<TouchableOpacity onPress={_shareBill}>
				<IconHeader name="share-alt" color={ColorsList.greyFont} />
			</TouchableOpacity>
			<TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { data: data, type: true })}>
				<IconHeader name="print" color={ColorsList.greyFont} />
			</TouchableOpacity>
		</Wrapper>
	}}>
		<Body>
			<AwanPopup.Loading visible={dataLoading} />
			{
				!dataLoading && <ViewShot ref={ref => viewShotRef = ref} options={Config.viewShotOpt()} style={{ backgroundColor: ColorsList.authBackground }}>
					<TearLines
						ref={ref => topLayout = ref}
						color="#FFFFFF"
						style={{ display: 'none' }}
						backgroundColor={ColorsList.authBackground}
					/>
					<View
						onLayout={e => {
							topLayout.onLayout(e);
							bottomLayout.onLayout(e);
						}}
						style={{ backgroundColor: ColorsList.whiteColor, padding: SizeList.padding, borderWidth: SizeList.borderWidth, borderColor: ColorsList.borderColor, borderRadius: SizeList.borderRadius }}>
						<Text font="SemiBold" align="center">{data ? data.transaction.name_store : null}</Text>
						<View style={{ ...$BorderRadius(5, 5, 0, 0), marginTop: 10, backgroundColor: ColorsList.whiteColor }}>
							<InfoWrapper>
								<Text>Kode Transaksi</Text>
								<Text>{data.transaction.payment_code}</Text>
							</InfoWrapper>
							<InfoWrapper>
								<Text>Waktu dan Tanggal</Text>
								<Text>{data.transaction.created_at}</Text>
							</InfoWrapper>
							<InfoWrapper>
								<Text>Pembayaran</Text>
								<Text>{data.transaction.id_payment_type == 1 ? "Tunai" : data.transaction.id_payment_type == 2 ? `Non Tunai(${data.transaction.method})` : "Piutang"}</Text>
							</InfoWrapper>
							<InfoWrapper>
								<Text>Operator</Text>
								<Text>{data.transaction.cashier}</Text>
							</InfoWrapper>
							{data.debt ?
								<InfoWrapper>
									<Text>Pelanggan</Text>
									<Text>{data.transaction.name_customer}</Text>
								</InfoWrapper>
								: null}
						</View>
						{data.debt ?
							<View>
								<Divider />
								<View style={{ backgroundColor: ColorsList.whiteColor, paddingVertical: 10, }}>
									<RowOpposite title="Jumlah hutang" content={convertRupiah(data.debt.total)} />
									<RowOpposite title="Jumlah yang sudah dibayar" content={convertRupiah(data.transaction.amount_payment)} />
									<RowOpposite title="Sisa hutang" content={convertRupiah(data.debt.remaining_debt)} />
									<RowOpposite
										style={data.transaction.status == 0 ? { color: ColorsList.warning } : null}
										title="Jatuh Tempo" content={formatToDays(data.debt.due_debt_date)} />
								</View>
							</View>
							: null
						}
						<View style={{ backgroundColor: ColorsList.whiteColor, marginBottom: 10, ...$BorderRadius(0, 0, 5, 5) }}>
							<View name="Daftar Produk" style={{ display: data.details_item.length == 0 ? "none" : "flex" }}>
								<View style={{ paddingVertical: 5, ...$Border(ColorsList.greyAuthHard, 0, 0, 1) }}>
									<Text align="center" font="SemiBold">Daftar Produk</Text>
								</View>
								{
									data.details_item.rMap((data) => {
										return <Wrapper width="100%" style={[$Padding(15, 0), $Border(ColorsList.greyAuthHard, 0, 0, 1)]} justify="space-between">
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
								<View style={{ paddingVertical: 5, ...$Border(ColorsList.greyAuthHard, 0, 0, 1) }}>
									<Text align="center" font="SemiBold">Pulsa dan Tagihan</Text>
								</View>
								{
									data.product_digital.rMap((item, i) => {
										return <View key={i.toString()}>
											<Divider />
											<Wrapper style={[$Padding(15, 0)]} justify="space-between">
												<View>
													<Text color="primary" size={15}>{item.transaction.transaction_name.split('_').join(' ').toUpperCase()}</Text>
													<Text>{item.transaction.customerID}</Text>
													{item.payment && item.payment.nama && <Text>{item.payment.nama}</Text>}
													<Text>{item.transaction.transaction_code}</Text>
												</View>
												<View style={{ alignItems: 'flex-end' }}>
													<Text color={item.transaction.status === "SUCCESS" ? 'success' : (data === "PENDING" ? 'info' : 'danger')}>{item.transaction.status}</Text>
													<Text>{convertRupiah(item.transaction.total)}</Text>
												</View>
											</Wrapper>

											{item.transaction.transaction_name == "pln_prepaid" && item.transaction.status == "SUCCESS" && [
												<View>
													<Wrapper justify="space-between">
														<Text>{item.payment.token.match(/.{1,4}/g).join("-")}</Text>
														<CopyButton onPress={() => {
															Toast.show({ text: "Berhasil disalin", type: "success" })
															Clipboard.setString(item.payment.token)
														}} />
													</Wrapper>
												</View>
											]}
										</View>
									})
								}
							</View>
							<Wrapper style={{
								paddingTop: SizeList.base
							}} justify="space-between">
								<Text>Subtotal</Text>
								<Text>{convertRupiah(data.transaction.sub_total)}</Text>
							</Wrapper>
							{
								data.transaction.discount &&
								<Wrapper style={[$Padding(5, 0)]} justify="space-between">
									<Text>Diskon</Text>
									<Text>{convertRupiah(data.transaction.discount)}</Text>
								</Wrapper>
							}
							{
								data.transaction.status != 1 &&
								<Wrapper style={{
									paddingTop: SizeList.base
								}} justify="space-between">
									<Text>Pembatalan Transaksi</Text>
									<Text>{convertRupiah(data.transaction.total_return)}</Text>
								</Wrapper>
							}
							<Wrapper style={[{
								paddingVertical: SizeList.base
							}, $Border(ColorsList.greyAuthHard, 0, 0, 1)]} justify="space-between">
								<Text font="SemiBold">Total</Text>
								<Text font="SemiBold">
									{
										data.transaction.status == 1 ?
											convertRupiah(data.transaction.total_transaction) :
											convertRupiah(data.transaction.remaining_return)
									}
								</Text>
							</Wrapper>
							<Wrapper style={{
								paddingTop: SizeList.base
							}} justify="space-between">
								<Text>Jumlah yang dibayar</Text>
								<Text>
									{convertRupiah(data.transaction.amount_payment)}
								</Text>
							</Wrapper>
							<Wrapper style={[{
								paddingVertical: SizeList.base
							}, $Border(ColorsList.greyAuthHard, 0, 0, 1)]} justify="space-between">
								<Text font="SemiBold">Kembalian</Text>
								<Text font="SemiBold">
									{convertRupiah(data.transaction.change_payment)}
								</Text>
							</Wrapper>
							{data.transaction.note !== "" &&
								<View style={[$Padding(10, 0), $Border(ColorsList.authBackground, 0, 0, 1)]}>
									<Text align="left" font="SemiBold">Note</Text>
									<Text align="left">{data.transaction.note}</Text>
								</View>
							}
						</View>
						<View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center" }}>
							<Text size={12} align="center">Powered by</Text>
							<Image style={{ width: 100, height: 70, resizeMode: "contain" }} source={require('src/assets/images/logostruk.png')} />
						</View>
					</View>
					<TearLines
						isUnder
						style={{ display: 'none' }}
						ref={ref => bottomLayout = ref}
						color="#FFFFFF"
						backgroundColor={ColorsList.authBackground}
					/>
				</ViewShot>
			}
		</Body>
		<Footer>
			{
				!dataLoading && !fromCashier && data.transaction.status != 3 &&
					data.transaction.status_payment == 2 ?
					<Wrapper justify="space-between">
						{_canBatal() && <Button wrapper={{ justify: 'center' }} color="link" _width="49%"
							onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })}
						>
							<Text color="primary">BATALKAN</Text>
						</Button>}
						<Button _width="49%" onPress={async () => {
							navigation.navigate('/drawer/transaction/detail/lunasi', { paramData: data })
						}}>LUNASI</Button>
					</Wrapper>
					:
					<Wrapper flexContent>
						{_canBatal() && <Button onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })} color="link">BATALKAN</Button>}
						{fromCashier && <Button onPress={_navigateFromCheckout}>SELESAI</Button>}
					</Wrapper>
			}
		</Footer>
	</Container >
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
		marginBottom: 10,
		borderColor: ColorsList.primary,
		borderRadius: 5
	}
})