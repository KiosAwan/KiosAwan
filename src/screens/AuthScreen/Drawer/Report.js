import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { convertRupiah } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory } from 'src/utils/authhelper'
import moment from 'moment';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';

const Report = ({ navigation }) => {
	let _keuangan = ["pajak", "service_charge"]
	let _laba = ["harga_pokok_penjualan"]
	let _notConvert = ["jumlah_transaksi", "product_terjual"]
	const [_report] = useState({ "penjualan_kotor": "", "discount": "", "total_return": "Pembatalan", "penjualan_bersih": "", "harga_pokok_penjualan": "", "pajak": "", "service_charge": "" })
	const [categories, setCategory] = useState([])
	const [indexTab, setIndexTab] = useState(0)
	const [filter, setFilter] = useState(false)
	const [filterParam, setFilterParam] = useState({})
	const [detailPendapatan, setDetailPendapatan] = useState(false)
	const [detailPenjualan, setDetailPenjualan] = useState(false)
	const [transaction, setTransaction] = useState({})
	const [reportCategory, setReportCategory] = useState([])
	const User = useSelector(state => state.User)
	const GetData = async (param) => {
		const res1 = await getTransactionData(User.store.id_store, param)
		const res2 = await getReportCategory(User.store.id_store, param)
		setTransaction(res1.data)
		setReportCategory(res2.data)
	}
	useEffect(() => {
		GetData({})
		setCategory([])
	}, [])

	const format = 'YYYY-MM-DD'
	const _handleFilter = async item => {
		let now = moment().set({ hours: 0, minutes: 0, seconds: 0 })
		let param = {
			from: now.add('month', item).endOf('month').set('date', 1).format(format),
			to: now.add('month', item).endOf('month').format(format)
		}
		setFilterParam(param)
		setFilter(false)
		GetData(param)
	}
	const _filterView = format => {
		return (filterParam.from ? moment(filterParam.from) : moment()).format(format)
	}
	const Keuangan = props => {
		return <View>
			<Wrapper justify="space-between" style={styles.report}>
				<View>
					<Text>{props.isLaba ? 'Laba/Rugi Kotor' : 'Total Pendapatan'}</Text>
					<Text font="ExtraBold" size={22} color="primary">{convertRupiah(indexTab == 0 ? transaction.total_penjualan : transaction.total_profit)}</Text>
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
				<TouchableOpacity onPress={() => setDetailPenjualan(!detailPenjualan)}>
					<Text font="ExtraBold" size={15}>DETAIL</Text>
				</TouchableOpacity>
			</Wrapper>
			<View onLayout={({ nativeEvent: { layout } }) => layout.height == 0 && categories.length > 0 ? setCategory([]) : null}>
				{
					detailPenjualan ?
						reportCategory.sort((a, b) => b.id_category - a.id_category).map(item => {
							let _id = item.id_category ? item.id_category : '~pesan_manual~'
							let _hasId = categories.includes(_id)
							if (!_hasId) categories.push(_id)
							return [_hasId ? null : <Wrapper style={{ ...Bg.grey, padding: 10 }}>
								<Text font={item.id_category ? null : 'BoldItalic'}>{item.id_category ? item.nama_category : 'Pesanan Manual'}</Text>
							</Wrapper>,
							<Wrapper justify="space-between" style={styles.report}>
								<View width="70%">
									<Text>{item.Product}</Text>
									<Text>{`${convertRupiah(item.harga_Satuan)} x ${item.jumlah}`}</Text>
								</View>
								<Wrapper direction="column" justify="center">
									<Text>{convertRupiah(item.harga)}</Text>
								</Wrapper>
							</Wrapper>]
						})
						: null
				}
			</View>
		</View>
	}
	return (
		<View style={styles.wrapper}>
			<GlobalHeader title="Report" onPressBack={() => navigation.navigate('/drawer')} />
			<AwanPopup.Menu backdropDismiss={() => setFilter(false)} visible={filter} title={_filterView('MMM, YYYY')}>
				<Button onPress={() => _handleFilter(0)} color="link" style={{ padding: 10 }} textProps={{ font: 'Regular' }} align="flex-start">Bulan Ini</Button>
				<Button onPress={() => _handleFilter(-1)} color="link" style={{ padding: 10 }} textProps={{ font: 'Regular' }} align="flex-start">Satu Bulan Lalu</Button>
				<Button onPress={() => _handleFilter(-2)} color="link" style={{ padding: 10 }} textProps={{ font: 'Regular' }} align="flex-start">Dua Bulan Lalu</Button>
				{/* <View style={{ padding: 10 }}>
					<Text>kjaskdhj</Text>
				</View> */}
			</AwanPopup.Menu>
			<Wrapper justify="space-between" style={styles.filterWrapper}>
				<View style={{ justifyContent: 'center' }}>
					<Text>{_filterView('MMMM YYYY')}</Text>
				</View>
				<Button onPress={() => setFilter(true)}>
					<Image style={{ width: 15, height: 15 }} source={require('src/assets/icons/filter.png')} />
				</Button>
			</Wrapper>
			{
				transaction ?
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
								<Text color="primary" font="Bold">{transaction.jumlah_transaksi || 0}</Text>
							</Wrapper>
							<Wrapper justify="space-between" style={styles.report}>
								<Text>Produk Terjual</Text>
								<Text color="primary" font="Bold">{transaction.product_terjual || 0}</Text>
							</Wrapper>
						</View>
						<View style={{ padding: 15, paddingTop: 0 }}>
							<Wrapper style={styles.tabButtonWrapper}>
								{
									['LAPORAN KEUANGAN', 'LAPORAN LABA/RUGI'].map((btn, i) => {
										return <Button disabled={indexTab == i} key={i} onPress={() => setIndexTab(i)} color={indexTab == i ? 'primary' : 'white'} textProps={{ align: 'center', size: 11 }} style={{ borderRadius: 0 }} _width="50%">{btn}</Button>
									})
								}
							</Wrapper>
							{indexTab == 0 ? <Keuangan /> : <Keuangan isLaba />}
						</View>
					</ScrollView>
					:
					<View style={{ alignItems: 'center' }}>
						<Image style={{ width: 350, height: 350 }} source={require('src/assets/images/no-transaction.png')} />
						<View style={{ alignItems: 'center' }}>
							<Text font="ExtraBold" size={17}>Anda belum memiliki transaksi</Text>
							<Text>Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
						</View>
					</View>
			}
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