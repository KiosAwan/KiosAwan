import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { RowOpposite } from 'src/components/Row/RowComp';
import { useDispatch } from 'react-redux';
import { getTransactionDetail, convertRupiah, formatToDays } from 'src/utils/authhelper';
import { WrapperItem } from 'src/components/Picker/SelectBoxModal';
import { FontList } from 'src/styles/typography';
import { BottomButton, Bottom, Button, Wrapper } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { RowChild } from 'src/components/Helper/RowChild';
import { ScrollView } from 'react-native-gesture-handler';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';

const TransactionDetail = ({ navigation }) => {
	let viewShotRef
	const dispatch = useDispatch()
	const [data, setData] = useState()
	const [dataLoading, SetDataLoading] = useState(true)
	const [back, setBack] = useState()
	useEffect(() => {
		_getData()
	}, [])

	const _shareBill = () => {
		viewShotRef.capture().then(uri => {
			const shareOptions = {
				url: uri,
				message: '',
				subject: 'Subject',
				title: 'Bagikan lewat'
			}
			Share.open(shareOptions);
		})
	}

	const _getData = async () => {
		const { transactionId } = await navigation.state.params
		const productData = await getTransactionDetail(transactionId)
		setData(productData.data)
		SetDataLoading(false)
		setBack(navigation.state.params.backState)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Detail Transaksi" onPressBack={() => back ? navigation.navigate(back) : navigation.goBack()} />
			<AwanPopup.Loading visible={dataLoading} />
			{dataLoading ? null :
				<View style={{ padding: 20, flex: 1 }}>
					<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: data.transaction.status_payment == 2 ? 50 : 100 }}>
						<ViewShot ref={ref => {
							viewShotRef = ref;
						}} options={{ format: "jpg", quality: 0.9 }} style={{ backgroundColor: 'white' }}>
							<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5 }}>
								<RowOpposite
									title="Kode Transaksi" content={data.transaction.payment_code} />
								<RowOpposite
									title="Waktu dan Tanggal" content={data.transaction.created_at} />
								<RowOpposite
									title="Pembayaran" content={data.transaction.id_payment_type == 1 ? "Tunai" : data.transaction.id_payment_type == 2 ? "Non Tunai" : "Piutang"} />
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
										style={data.transaction.status == 0 ? { color: ColorsList.warning } : null}
										title="Jatuh Tempo" content={formatToDays(data.debt.due_debt_date)} />
								</View>
								: null
							}
							<View style={{ alignSelf: "center", padding: 10 }}>
								<Text size={16}>Daftar Produk</Text>
							</View>
							<View style={{ backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
								{
									data.details_item.map((data, i) => {
										return (
											<WrapperItem key={i} style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
												<Text style={{ color: ColorsList.primaryColor, fontSize: 15 }}>{data.product}</Text>,
												<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price)} x {data.qty}</Text>
											]} right={[
												<Text></Text>,
												<Text style={{ color: ColorsList.greyFont }}>{convertRupiah(data.price * data.qty)}</Text>
											]} />
										)
									})
								}
								<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
									<Text style={{ ...FontList.subtitleFontGreyBold }}>Subtotal</Text>,
								]} right={
									<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(data.transaction.sub_total)}</Text>
								} />
								{data.transaction.discount ?
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
										<Text style={{ ...FontList.subtitleFontGreyBold }}>Diskon</Text>,
									]} right={
										<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(data.transaction.discount)}</Text>
									} /> : null}
								{data.transaction.status != 1 ?
									<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
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
						</ViewShot>
					</ScrollView>
				</View>
			}

			<Bottom>
				{
					data.transaction.status_payment == 2 ?
						[
							<Button width="49%" color="white" onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })}>BATALKAN</Button>,
							<Button onPress={() => navigation.navigate('/drawer/transaction/detail/lunasi', { paramData: data })} width="49%" onpre>LUNASI</Button>
						]
						:
						data.transaction.status == 3 ?
							<Button width="100%" onPress={_shareBill}>CETAK STRUK</Button>
							:
							<View style={{ width: '100%' }}>
								<Button onPress={() => navigation.navigate('/drawer/transaction/detail/batalkan', { paramData: data })} color="white" width='100%'>BATALKAN</Button>
								<Wrapper style={{ marginTop: 5 }} justify="space-between">
									<Button onPress={_shareBill} _width="49.5%">
										<Image style={{ height: 25, width: 25, marginRight: 10 }} source={require('../../../../assets/icons/share.png')} />
										<Text style={styles.btnwithIconText}>Kirim Struk</Text>
									</Button>
									<Button onPress={() => { }} _width="49.5%">
										<Image style={{ height: 25, width: 25 }} source={require('src/assets/icons/print.png')} />
										<Text style={styles.btnwithIconText}>Cetak Struk</Text>
									</Button>
								</Wrapper>
							</View>
				}
			</Bottom>
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