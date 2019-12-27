import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { Button, Wrapper } from 'src/components/Button/ButtonComp';
import { convertRupiah } from 'src/utils/authhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory } from 'src/utils/authhelper'

const Report = ({ navigation }) => {
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
	}, [])

	const Keuangan = props => {
		return <View>
			<Wrapper justify="space-between" style={styles.report}>
				<View>
					<Text>{props.isLaba ? 'Laba/Rugi Kotor' : 'Total Pendapatan'}</Text>
					<Text font="ExtraBold" size={25} color="primary">{convertRupiah(2000)}</Text>
				</View>
				<TouchableOpacity onPress={() => setDetailPendapatan(!detailPendapatan)} style={{ justifyContent: 'flex-end' }}>
					<Text font="ExtraBold" size={15}>DETAIL</Text>
				</TouchableOpacity>
			</Wrapper>
			{detailPendapatan ?
				<View>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Total Penjualan</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Diskon</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Pembatalan</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Penjualan Bersih</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
					{props.isLaba ?
						<Wrapper justify="space-between" style={styles.report}>
							<Text>Harga Pokok Penjualan</Text>
							<Text>{convertRupiah(2000)}</Text>
						</Wrapper>
						:
						[
							<Wrapper justify="space-between" style={styles.report}>
								<Text>Pajak</Text>
								<Text>{convertRupiah(2000)}</Text>
							</Wrapper>,
							<Wrapper justify="space-between" style={styles.report}>
								<Text>Service Charge</Text>
								<Text>{convertRupiah(2000)}</Text>
							</Wrapper>
						]
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
			{detailPenjualan ?
				<View>
					<Wrapper justify="center" style={{ ...Bg.grey, padding: 10 }}>
						<Text>Kategori #1</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Nama Produk #1</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Nama Produk #2</Text>
						<Text>{convertRupiah(2000)}</Text>
					</Wrapper>
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
					<Text>Desember 2019</Text>
				</View>
				<Button onPress={() => setFilter(true)}>
					<Image style={{ width: 15, height: 15 }} source={require('src/assets/icons/filter.png')} />
				</Button>
			</Wrapper>
			<ScrollView>
				<View style={{ padding: 15 }}>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Total Penjualan</Text>
						<Text color="primary" font="Bold">{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Total Keuntungan</Text>
						<Text color="primary" font="Bold">{convertRupiah(2000)}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Transaksi</Text>
						<Text color="primary" font="Bold">{20}</Text>
					</Wrapper>
					<Wrapper justify="space-between" style={styles.report}>
						<Text>Produk Terjual</Text>
						<Text color="primary" font="Bold">{20}</Text>
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