import React, { useState, useEffect } from 'react';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { Button, Wrapper } from 'src/components/Button/ButtonComp';
import { convertRupiah } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory } from 'src/utils/authhelper'
import moment from 'moment';

const Report = ({ navigation }) => {
	let _keuangan = ["pajak", "service_charge"]
	let _laba = ["harga_pokok_penjualan"]
	let _notConvert = ["jumlah_transaksi", "product_terjual"]
	const [_report] = useState({ "penjualan_kotor": "", "discount": "", "total_return": "Pembatalan", "penjualan_bersih": "", "harga_pokok_penjualan": "", "pajak": "", "service_charge": "" })
	const [categories, setCategory] = useState([])
	const [indexTab, setIndexTab] = useState(0)
	const [filter, setFilter] = useState(false)
	const [detailPendapatan, setDetailPendapatan] = useState(false)
	const [detailPenjualan, setDetailPenjualan] = useState(false)
	const [transaction, setTransaction] = useState({})
	const [reportCategory, setReportCategory] = useState({})
	const User = useSelector(state => state.User)
	const GetData = async () => {
		const res1 = await getTransactionData(User.store.id_store)
		const res2 = await getReportCategory(User.store.id_store)
		setTransaction(res1.data)
		setReportCategory(res2.data)
	}
	useEffect(() => {
		GetData()
		setCategory([])
	}, [])


	const Keuangan = props => {
		return <View>
			<Wrapper justify="space-between" style={styles.report}>
				<View>
					<Text>{props.isLaba ? 'Laba/Rugi Kotor' : 'Total Pendapatan'}</Text>
					<Text font="ExtraBold" size={25} color="primary">{convertRupiah(indexTab == 0 ? transaction.total_penjualan : transaction.total_profit)}</Text>
				</View>
				<TouchableOpacity onPress={() => setDetailPendapatan(!detailPendapatan)} style={{ justifyContent: 'flex-end' }}>
					<Text font="ExtraBold" size={15}>DETAIL</Text>
				</TouchableOpacity>
			</Wrapper>
			{detailPendapatan ?
				<View>
					{
						Object.keys(_report).map(key => {
							let toHide = indexTab == 0 ? _laba : _keuangan
							return toHide.includes(key) ? null : <Wrapper justify="space-between" style={styles.report}>
								<Text>{_report[key] ? _report[key] : key.split('_').join(' ').ucwords()}</Text>
								{_notConvert.includes(key) ? <Text>{transaction[key]}</Text> : <Text>{convertRupiah(transaction[key])}</Text>}
							</Wrapper>
						})
					}
				</View>
				: null
			}
			<Wrapper justify="space-between" style={{ marginTop: 15, padding: 15, ...Bg.white }}>
				<Text color="primary" font="Bold">Laporan Penjualan</Text>
				<TouchableOpacity onPress={() => {
					if (!detailPenjualan) setCategory([])
					setDetailPenjualan(!detailPenjualan)
				}}>
					<Text font="ExtraBold" size={15}>DETAIL</Text>
				</TouchableOpacity>
			</Wrapper>
			{
				detailPenjualan ?
					<View>
						{
							reportCategory.sort((a, b) => b.id_category - a.id_category).map(item => {
								let _id = item.id_category ? item.id_category : '~pesan_manual~'
								let _hasId = categories.includes(_id)
								if (!_hasId) categories.push(_id)
								return [_hasId ? null : <Wrapper justify="center" style={{ ...Bg.grey, padding: 10 }}>
									<Text font={item.id_category ? null : 'BoldItalic'}>{item.id_category ? item.nama_category : 'Pesanan Manual'}</Text>
								</Wrapper>,
								<Wrapper justify="space-between" style={styles.report}>
									<View>
										<Text>{item.Product}</Text>
										<Text>{`${convertRupiah(item.harga_Satuan)} x ${item.jumlah}`}</Text>
									</View>
									<Wrapper direction="column" justify="center">
										<Text>{convertRupiah(item.harga)}</Text>
									</Wrapper>
								</Wrapper>]
							})
						}
					</View>
					: null
			}
		</View>
	}
	return (
		<View style={styles.wrapper}>
			<GlobalHeader title="Report" onPressBack={() => navigation.navigate('/drawer')} />
			<AwanPopup.Menu backdropDismiss={() => setFilter(false)} visible={filter} title="Des, 2019">
				<Button color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Bulan Ini</Button>
				<Button color="link" style={{ padding: 0 }} textProps={{ font: 'Regular' }} align="flex-start">Satu Bulan Lalu</Button>
			</AwanPopup.Menu>
			<Wrapper justify="space-between" style={styles.filterWrapper}>
				<View style={{ justifyContent: 'center' }}>
					<Text>{moment().format('MMMM YYYY')}</Text>
				</View>
				<Button onPress={() => setFilter(true)}>
					<Image style={{ width: 15, height: 15 }} source={require('src/assets/icons/filter.png')} />
				</Button>
			</Wrapper>
			<ScrollView>
				<View style={{ padding: 15 }}>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Total Penjualan</Text>
						<Text color="primary" font="Bold">{convertRupiah(transaction.total_penjualan)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Total Keuntungan</Text>
						<Text color="primary" font="Bold">{convertRupiah(transaction.total_profit)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Transaksi</Text>
						<Text color="primary" font="Bold">{transaction.jumlah_transaksi}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Produk Terjual</Text>
						<Text color="primary" font="Bold">{transaction.product_terjual}</Text>
					</Wrapper>
				</View>
				<View style={{ padding: 15, paddingTop: 0 }}>
					<Wrapper style={styles.tabButtonWrapper}>
						{
							['LAPORAN KEUANGAN', 'LAPORAN LABA/RUGI'].map((btn, i) => {
								return <Button disabled={indexTab == i} key={i} onPress={() => setIndexTab(i)} color={indexTab == i ? 'primary' : 'white'} textProps={{ size: 12 }} style={{ borderRadius: 0 }} width="50%">{btn}</Button>
							})
						}
					</Wrapper>
					{indexTab == 0 ? <Keuangan /> : <Keuangan isLaba />}
				</View>
			</ScrollView>
		</View>
	)
}

export default Report

let Bg = StyleSheet.create({
	white: { backgroundColor: ColorsList.whiteColor },
	grey: { backgroundColor: ColorsList.greyAuthHard }
})
const styles = StyleSheet.create({
	wrapper: { flex: 1, backgroundColor: ColorsList.authBackground },
	filterWrapper: { ...Bg.white, padding: 15, paddingHorizontal: 25 },
	report: { ...Bg.white, padding: 15, marginBottom: 1 },
	tabButtonWrapper: { padding: 15, paddingBottom: 0, backgroundColor: ColorsList.whiteColor }
})