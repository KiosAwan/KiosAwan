import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { RowOpposite } from 'src/components/Row/RowComp';
import { useDispatch } from 'react-redux';
import { getTransactionDetail, convertRupiah, formatToDays } from 'src/utils/authhelper';
import { WrapperItem } from 'src/components/Picker/SelectBoxModal';
import { FontList } from 'src/styles/typography';
import { Icon } from 'native-base';
import { BottomButton, Bottom, Button } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { RowChild } from 'src/components/Helper/RowChild';
import { ScrollView } from 'react-native-gesture-handler';

const TransactionDetail = ({ navigation }) => {
	const dispatch = useDispatch()
	const [transactionId, setTransactionId] = useState('')
	const [data, setData] = useState()
	const [dataLoading, SetDataLoading] = useState(true)
	useEffect(() => {
		_getData()
	}, [])

	const _getData = async () => {
		const { transactionId } = await navigation.state.params
		const productData = await getTransactionDetail(25)
		setData(productData.data)
		SetDataLoading(false)
	}
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader title="Detail Transaksi"
				onPressBack={() => navigation.goBack()}
			/>
			{dataLoading ? <Text>Loading</Text> :
				<View style={{flex : 1}}>
				<View style={{ padding: 20, flex: 1 }}>
					<ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, marginBottom: data.transaction.status_payment == 1 ? 100 : 50 }}>
						<View style={{ backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5 }}>
							<RowOpposite
								title="Kode Transaksi" content={data.transaction.payment_code} />
							<RowOpposite
								title="Waktu dan Tanggal" content={data.transaction.created_at} />
							<RowOpposite
								title="Pembayaran" content={data.transaction.id_payment == 1 ? "Tunai" : data.transaction.id_payment == 2 ? "Non Tunai" : "Piutang"} />
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
										<WrapperItem style={{ padding: 10, paddingHorizontal: 15, borderBottomWidth: 3, borderBottomColor: ColorsList.authBackground }} left={[
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
							<WrapperItem style={{ padding: 10, paddingHorizontal: 15 }} left={[
								<Text style={{ ...FontList.subtitleFontGreyBold }}>Total</Text>,
							]} right={
								<Text style={{ ...FontList.subtitleFontGreyBold }}>{convertRupiah(data.transaction.total_transaction)}</Text>
							} />
						</View>
					</ScrollView>
				</View>
				{data.transaction.status_payment == 2 ?
				<Bottom justify="space-between">
					<Button width="49%" color="white">BATALKAN</Button>
					<Button onPress={() => navigation.navigate('/drawer/transaction/detail/lunasi', {paramData : data })} width="49%" onpre>LUNASI</Button>
				</Bottom>

				:
				<View style={{ position: "absolute", bottom: 10, alignSelf: "center", backgroundColor: ColorsList.authBackground }}>
					<BottomButton
						onPressBtn={() => alert("asdad")}
						style={{ backgroundColor: ColorsList.whiteColor, width: SizeList.width - 40, borderColor: ColorsList.primaryColor, borderWidth: 1, }}
						textStyle={{ color: ColorsList.primaryColor }}
						buttonTitle="BATALKAN"
					/>
					<View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
						<TouchableOpacity>
							<View style={[styles.wrapIconText]} >
								<Icon color={ColorsList.whiteColor} size={16} style={{ marginRight: 5 }} name="paper-plane" />
								<Text style={styles.btnwithIconText}>Kirim Struk</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity>
							<View style={[styles.wrapIconText]} >
								<Icon color={ColorsList.whiteColor} size={16} style={{ marginRight: 5 }} name="print" />
								<Text style={styles.btnwithIconText}>Cetak Struk</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>

			}
				</View>
			}
			
		</View >
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