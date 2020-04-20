import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { AwanPopup, Dropdown, Modal } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory, getReportNonTunai } from 'src/utils/authhelper'
import moment from 'moment';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import Container, { Body } from 'src/components/View/Container';
import { TabView } from 'react-native-tab-view';
import { stateObject } from 'src/utils/state';
import { $BorderRadius } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';

const Report = ({ navigation }) => {
	const [firstOpen, setFirstOpen] = useState(true)
	const [data, setData] = stateObject({
		dataTransaction: {},
		dataReportCategory: [],
		dataReportNonTunai: []
	})
	const { dataTransaction, dataReportCategory, dataReportNonTunai } = data
	const User = useSelector(state => state.User)
	const GetData = async param => {
		const { data: dataReportCategory } = await getReportCategory(User.store.id_store, param)
		const { data: dataTransaction } = await getTransactionData(User.store.id_store, param)
		const { data: dataReportNonTunai } = await getReportNonTunai(User.store.id_store, param)
		setData({ dataTransaction, dataReportCategory, dataReportNonTunai })
		setNT({ selected: dataReportNonTunai[0] })
		if (firstOpen) {
			setFirstOpen(false)
		}
	}

	useEffect(() => {
		GetData({})
	}, [])

	let format = 'YYYY-MM-DD'
	const header = {
		title: "Laporan",
		image: require('src/assets/icons/filter.png'),
		onPressBack: () => navigation.goBack(),
		onPressIcon: () => setCtrl({ visible: true })
	}
	let _dateSelected
	const [dateSelected, setDateSelected] = useState()
	const [NT, setNT] = stateObject()
	const _filterData = ({ filter, index }) => {
		if (!filter) {
			filter = _dateSelected
		}
		if (!index) {
			index = _MainTabIndex
		}
		let date = moment(filter)
		const [from, to] = [date.startOf('month').format(format), date.endOf('month').format(format)]
		let tipe_product = index == 1 ? 'product' : index == 2 ? 'ppob' : ''
		// console.debug({ from, to, tipe_product })
		GetData({ from, to, tipe_product })
	}
	const [ctrl, setCtrl] = stateObject({
		setVisible: visible => setCtrl({ visible }),
		setFilter: filter => {
			_dateSelected = filter
			setDateSelected(filter)
			_filterData({ filter })
		},
		visible: false
	})
	let _MainTabIndex
	const [MainTab, setMainTab] = stateObject({
		index: 0,
		routes: [
			{ key: 'first', title: 'Semua' },
			{ key: 'second', title: 'Penjualan Produk' },
			{ key: 'third', title: 'Penjualan PPOB' }
		],
		initialLayout: { width: 300, height: 300 },
		setIndex: index => {
			_MainTabIndex = index
			setMainTab({ index })
			_filterData({ index })
		}
	})
	const [SecondaryTab, setSecondaryTab] = stateObject({
		index: 0,
		routes: [
			{ key: 'first', title: 'Laporan Keuangan' },
			{ key: 'second', title: 'Laporan Penjualan' }
		],
		initialLayout: { width: 300, height: 300 },
		setIndex: index => setSecondaryTab({ index })
	})

	const _renderMainTab = ({ route }) => {
		const _renderSecondaryTab = ({ route }) => {
			return <View>
				{route.key == 'first' ?
					<View>
						<View style={{ backgroundColor: ColorsList.white, marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Ringkasan Laporan Keuangan</Text>
							<Divider />
							<Wrapper style={{ padding: 10 }} spaceBetween>
								<View>
									<Text>Total Pendapatan</Text>
									<Text size={17} color="primary">{dataTransaction.total_profit && dataTransaction.total_profit.convertRupiah()}</Text>
								</View>
								<Button onPress={() => setCtrl({ dataTransaction: !ctrl.dataTransaction })} color="link">DETAIL</Button>
							</Wrapper>
							{
								dataTransaction && ctrl.dataTransaction &&
								['penjualan_kotor', 'discount', 'total_return', 'penjualan_bersih', 'pajak', 'service_charge']
									.map((key, i) => <Wrapper style={{ padding: 10 }} spaceBetween>
										<Text>{key.split('_').join(' ').ucwords()}</Text>
										<Text>{dataTransaction[key].convertRupiah()}</Text>
									</Wrapper>)
							}
						</View>
						<View style={{ backgroundColor: ColorsList.white, marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Ringkasan Laporan Laba/Rugi Kotor</Text>
							<Divider />
							<Wrapper style={{ padding: 10 }} spaceBetween>
								<View>
									<Text>Total Pendapatan</Text>
									<Text size={17} color="primary">{dataTransaction.total_penjualan && dataTransaction.total_penjualan.convertRupiah()}</Text>
								</View>
								<Button onPress={() => setCtrl({ labaRugiKotor: !ctrl.labaRugiKotor })} color="link">DETAIL</Button>
							</Wrapper>
							{
								dataTransaction && ctrl.labaRugiKotor &&
								['penjualan_kotor', 'discount', 'total_return', 'penjualan_bersih', 'pajak', 'harga_pokok_penjualan']
									.map((key, i) => <Wrapper style={{ padding: 10 }} spaceBetween>
										<Text>{key.split('_').join(' ').ucwords()}</Text>
										<Text>{dataTransaction[key].convertRupiah()}</Text>
									</Wrapper>)
							}
						</View>
						<View style={{ backgroundColor: ColorsList.white, marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Ringkasan Laporan Non Tunai</Text>
							<Divider />
							<SelectBoxModal
								closeOnSelect
								label="Filter Data"
								data={dataReportNonTunai}
								value={NT.selected ? NT.selected.method : ''}
								handleChangePicker={selected => setNT({ selected })}
								renderItem={item => <Text color={NT.selected && NT.selected.method == item.method ? 'primary' : 'greyFont'}>{item.method}</Text>}
								style={{ paddingHorizontal: 10 }}
							/>
							<Wrapper style={{ padding: 10 }} spaceBetween>
								<View>
									<Text>Total Pendapatan</Text>
									<Text size={17} color="primary">{NT.selected && NT.selected.penjualan_bersih && NT.selected.penjualan_bersih.convertRupiah()}</Text>
								</View>
								<Button onPress={() => setCtrl({ dataReportNonTunai: !ctrl.dataReportNonTunai })} color="link">DETAIL</Button>
							</Wrapper>
							{
								ctrl.dataReportNonTunai && Object.keys(NT.selected).map((key, i) => key != 'method' && <Wrapper style={{ padding: 10 }} spaceBetween>
									<Text>{key.split('_').join(' ').ucwords()}</Text>
									<Text>{NT.selected[key].convertRupiah()}</Text>
								</Wrapper>)
							}
						</View>
					</View> :
					<View style={{ backgroundColor: ColorsList.white }}>
						{
							dataReportCategory.map(({ harga, data, nama_category }) => <View>
								<Text style={{ backgroundColor: ColorsList.greyAuthHard, padding: 10 }} font={nama_category ? 'Regular' : 'Italic'} align="center">{nama_category ? nama_category : '~ Pesanan Manual ~'}</Text>
								{
									data && data.map(({ Product, harga_jual, total, jumlah }, i) => [
										<Wrapper style={{ padding: 10 }} spaceBetween>
											<View>
												<Text>{Product}</Text>
												<Text>{harga_jual.convertRupiah()} x {jumlah}</Text>
											</View>
											<Text>{total.convertRupiah()}</Text>
										</Wrapper>,
										i < data.length && <Divider />
									])
								}
							</View>)
						}
					</View>
				}
			</View>
		}
		return <Body style={{ paddingTop: 0 }}>
			<View style={{ borderRadius: 5, backgroundColor: ColorsList.white }}>
				<Wrapper>
					<View style={{ padding: 10 }}>
						<Text color="primary" size={17} align="center">{dataTransaction.total_penjualan && dataTransaction.total_penjualan.convertRupiah()}</Text>
						<Text align="center">Total Penjualan</Text>
					</View>
					<Divider flex />
					<View style={{ padding: 10 }}>
						<Text color="primary" size={17} align="center">{dataTransaction.total_profit && dataTransaction.total_profit.convertRupiah()}</Text>
						<Text align="center">Total Keuntungan</Text>
					</View>
				</Wrapper>
				<Divider />
				<Wrapper spaceBetween style={{ padding: 10 }}>
					<Text>Transaksi</Text>
					<Text color="primary">{dataTransaction.jumlah_transaksi}</Text>
				</Wrapper>
				<Divider />
				<Wrapper spaceBetween style={{ padding: 10 }}>
					<Text>Produk Terjual</Text>
					<Text color="primary">{dataTransaction.produk_terjual}</Text>
				</Wrapper>
			</View>
			<TabView
				style={firstOpen && { display: 'none' }}
				renderTabBar={({ navigationState }) => {
					const { index, routes, setIndex } = navigationState
					return <Wrapper style={{ padding: 15 }} flexContent>
						{
							routes.map((route, i) => {
								return <Button
									borderBottom
									active={index == i}
									disabled={index == i}
									color={['greyFont']}
									onPress={() => setIndex(i)}
									activeColor="primary">{route.title}</Button>
							})
						}
					</Wrapper>
				}}
				navigationState={SecondaryTab}
				renderScene={_renderSecondaryTab}
				onIndexChange={SecondaryTab.setIndex}
				initialLayout={SecondaryTab.initialLayout}
			/>
		</Body>
	}

	return <Container header={header}>
		<ModalMonth {...ctrl} />
		<TabView
			renderTabBar={({ navigationState }) => {
				const { index, routes, setIndex } = navigationState
				return <View>
					<Wrapper style={{ padding: 15 }} flexContent noWrapper>
						{
							routes.map((route, i) => {
								return <Button
									textStyle={{ fontSize: 15 }}
									disabled={index == i}
									onPress={() => setIndex(i)}
									active={index == i}
									color="white"
									activeColor="primary"
									noRadius
									style={{
										flex: 1,
										justifyContent: 'center',
										...i == 0 && $BorderRadius(5, 0, 0, 5),
										...i == routes.length - 1 && $BorderRadius(0, 5, 5, 0)
									}}
								>{route.title}</Button>
							})
						}
					</Wrapper>
					<Text style={{ paddingHorizontal: 15, paddingBottom: 10 }}>{moment(dateSelected).format('MMMM YYYY')}</Text>
				</View>
			}}
			navigationState={MainTab}
			renderScene={_renderMainTab}
			onIndexChange={MainTab.setIndex}
			initialLayout={MainTab.initialLayout}
		/>
	</Container>
}

export default Report


const ModalMonth = props => {
	const { visible, setVisible, year, month, setFilter } = props
	const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
	const [filter, _setFilter] = stateObject({
		year: parseInt(year || moment().format('YYYY')),
		month: parseInt(month || moment().format('MM')) - 1
	})
	const _filterMonth = month => {
		_setFilter({ month })
	}
	return <Modal style={{ width: '90%', padding: 15, paddingVertical: 15 }} visible={visible} backdropDismiss={() => setVisible(false)}>
		<Wrapper spaceBetween>
			<Button onPress={() => _setFilter({ year: filter.year - 1 })} color="link">{'<'}</Button>
			<Text>{filter.year}</Text>
			<Button onPress={() => _setFilter({ year: filter.year + 1 })} color="link">{'>'}</Button>
		</Wrapper>
		<FlatList
			style={{ marginVertical: 15 }}
			data={bulan}
			numColumns={3}
			keyExtractor={(a, i) => i.toString()}
			renderItem={({ item, index: i }) => <Button onPress={() => _filterMonth(i)} style={{ margin: 5 }} active={i == filter.month} color={['transparent', 'greyFont', 'greyFont']} activeColor="primary" flex>{item}</Button>}
		/>
		<Button onPress={() => {
			setFilter(`${filter.year}-${filter.month.toString().length == 1 ? '0' : ''}${filter.month + 1}`)
			setVisible(false)
		}} color="white">TERAPKAN</Button>
	</Modal >
}