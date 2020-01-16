import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { RowOpposite } from 'src/components/Row/RowComp';
import { getTransactionDetail, convertRupiah, formatToDays } from 'src/utils/authhelper';
import { WrapperItem } from 'src/components/Picker/SelectBoxModal';
import { FontList } from 'src/styles/typography';
import { SizeList } from 'src/styles/size';
import { RowChild } from 'src/components/Helper/RowChild';
import { ScrollView } from 'react-native-gesture-handler';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import ViewShot from 'react-native-view-shot';
import Screenshot, { Config } from 'src/utils/screenshot';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { $BorderRadius } from 'src/utils/stylehelper';

const TransactionDetail = ({ navigation }) => {
	let viewShotRef
	const [data, setData] = useState()
	const [dataLoading, SetDataLoading] = useState(true)
	const [back, setBack] = useState()
	useEffect(() => {
		_getData()
	}, [])

	const _shareBill = async () => {
		let imgPath = await Screenshot.take(viewShotRef)
		Screenshot.share({ url: imgPath })
	}

	const _getData = async () => {
		const { transactionId } = await navigation.state.params
		const productData = await getTransactionDetail(transactionId)
		setData(productData.data)
		setBack(navigation.state.params.backState)
		SetDataLoading(false)
	}
	const [edgeWidth, setEdgeWidth] = useState(0)
	const _renderEdge = ({ nativeEvent: { layout } }) => {
		let width = Math.round(layout.width / 20)
		setEdgeWidth(width)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Detail Transaksi" onPressBack={() => back ? navigation.navigate(back) : navigation.goBack()} />
			<AwanPopup.Loading visible={dataLoading} />
			{dataLoading ? null :
				<View style={{ padding: 20, flex: 1 }}>
					<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: data.transaction.status == 3 ? 0 : 90 }}>
						<ViewShot ref={ref => viewShotRef = ref} options={Config.viewShotOpt()} style={{ paddingVertical: 10, backgroundColor: ColorsList.authBackground }}>
							<View style={{ flexDirection: 'row', justifyContent: 'center' }}>
								{
									edgeWidth > 0 ? Array.generateEmpty(edgeWidth).map((i) => <Image key={i} style={{ height: 20, width: 20, resizeMode: 'stretch', marginBottom: -1 }} source={require('src/assets/icons/bill-edge.png')} />) : null
								}
							</View>
							<View onLayout={_renderEdge} style={{ backgroundColor: ColorsList.whiteColor }}>
								<View>
									<Text align="center">{data ? data.transaction.name_store : null}</Text>
								</View>
								<View style={{ ...$BorderRadius(5, 5, 0, 0), marginTop: 10, backgroundColor: ColorsList.whiteColor, padding: 10 }}>
									<RowOpposite
										title="Kode Transaksi" content={data.transaction.payment_code} />
									<RowOpposite
										title="Waktu dan Tanggal" content={data.transaction.created_at} />
									<RowOpposite
										title="Pembayaran" content={data.transaction.id_payment_type == 1 ? "Tunai" : data.transaction.id_payment_type == 2 ? `Non Tunai(${data.transaction.method})` : "Piutang"} />
									<RowOpposite
										title="Operator" content={data.transaction.cashier} />
									{data.debt ?
										<RowOpposite
											title="Pelanggan" content={data.transaction.name_customer} />
										: null}
								</View>
								{data.debt ?
									// <View style={{ height: 1, backgroundColor: ColorsList.greyFont, width: '100%' }} />
									<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopColor: ColorsList.greySoft, borderTopWidth: 1 }}>
										<RowOpposite
											title="Jumlah Hutang" content={convertRupiah(data.debt.total)} />
										<RowOpposite
											title="Jumlah yang sudah dibayar" content={convertRupiah(data.transaction.amount_payment)} />
											<RowOpposite
											title="Sisa hutang" content={convertRupiah(data.debt.remaining_debt)} />
										<RowOpposite
											style={data.transaction.status == 0 ? { color: ColorsList.warning } : null}
											title="Jatuh Tempo" content={formatToDays(data.debt.due_debt_date)} />
									</View>
									: null
								}
								<View style={{ padding: 10, backgroundColor: ColorsList.greyAuthHard, width: '100%' }}>
									<Text align="center" size={16}>Daftar Produk</Text>
								</View>
								<View style={{ backgroundColor: 'white', marginBottom: 10, ...$BorderRadius(0, 0, 5, 5) }}>
									{
										data.details_item.map((data, i) => {
											return (
												<WrapperItem key={i} style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: ColorsList.authBackground }} left={[
													<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.product}</Text>,
													<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price)} x {data.qty}</Text>
												]} right={[
													<Text></Text>,
													<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.total)}</Text>
												]} />
											)
										})
									}
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: ColorsList.authBackground }} left={[
										<Text style={{ ...FontList.subtitleFontGreyBold }}>Subtotal</Text>,
									]} right={
										<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(data.transaction.sub_total)}</Text>
									} />
									{data.transaction.discount ?
										<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: ColorsList.authBackground }} left={[
											<Text style={{ ...FontList.subtitleFontGreyBold }}>Diskon</Text>,
										]} right={
											<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(data.transaction.discount)}</Text>
										} /> : null}
									{data.transaction.status != 1 ?
										<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: ColorsList.authBackground }} left={[
											<Text style={{ ...FontList.subtitleFontGreyBold }}>Pembatalan transaksi</Text>,
										]} right={
											<Text style={{ ...FontList.subtitleFontGreyBold, color: ColorsList.danger }}>{convertRupiah(data.transaction.total_return)}</Text>
										} /> : null}
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
										<Text style={{ ...FontList.subtitleFontGreyBold }}>Total</Text>,
									]} right={
										<Text style={{ ...FontList.subtitleFontGreyBold }}>{data.transaction.status == 1 ? convertRupiah(data.transaction.total_transaction) : convertRupiah(data.transaction.remaining_return)}</Text>
									} />
								</View>
								<View style={{ alignItems: 'center' }}>
									<Text align="center">Powered by</Text>
									<Image style={{ width: 150, height: 70 }} source={require('src/assets/images/logo.png')} />
								</View>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'center', transform: [{ rotate: '180deg' }] }}>
								{
									edgeWidth > 0 ? Array.generateEmpty(edgeWidth).map((i) => <Image key={i} style={{ height: 20, width: 20, resizeMode: 'stretch', marginBottom: -1 }} source={require('src/assets/icons/bill-edge.png')} />) : null
								}
							</View>
						</ViewShot>
					</ScrollView>
				</View>
			}
			{dataLoading ? null :
				<Bottom>
					{
						data.transaction.status == 3 ?
							null
							:
							data.transaction.status_payment == 2 ?
								[
									<Button width="49%" color="white" onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })}>BATALKAN</Button>,
									<Button onPress={() => navigation.navigate('/drawer/transaction/detail/lunasi', { paramData: data })} width="49%" onpre>LUNASI</Button>
								] :
								<View style={{ width: '100%' }}>
									<Button onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })} color="white" width='100%'>BATALKAN</Button>
									<Wrapper style={{ marginTop: 5 }} justify="space-between">
										<Button onPress={_shareBill} _width="49.5%">
											<Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('src/assets/icons/share.png')} />
											<Text style={styles.btnwithIconText}>KIRIM STRUK</Text>
										</Button>
										<Button onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', { data: data })} _width="49.5%">
											<Image style={{ height: 25, width: 25 }} source={require('src/assets/icons/print.png')} />
											<Text style={styles.btnwithIconText}>CETAK STRUK</Text>
										</Button>
									</Wrapper>
								</View>
					}
				</Bottom>
			}
		</View>
	)
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
})