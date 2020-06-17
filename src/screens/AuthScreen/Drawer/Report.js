import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { Modal } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory, getReportNonTunai } from 'src/utils/authhelper'
import moment from 'moment';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import Container, { Body } from 'src/components/View/Container';
import { stateObject } from 'src/utils/state';
import Divider from 'src/components/Row/Divider';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';
import { GlobalHeader, IconHeader } from 'src/components/Header/Header';
import { SizeList } from 'src/styles/size';
import { shadowStyle } from 'src/components/Input/MDInput';
import Icon from 'react-native-vector-icons/FontAwesome5'
const ViewShadow = props => <View style={{ marginBottom: SizeList.base, padding: props.noPadding ? 0 : SizeList.padding, }}>
	{!props.noTitle && <Text>{props.title}</Text>}
	<View {...props} style={[{ marginTop: SizeList.base }, shadowStyle, props.style]} />
</View>

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
			{ key: 'first', title: 'Semua Laporan' },
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
	const _convertRupiah = (data, key) => {
		let value = !data ? '' : data[key] || ''
		return value.toString().convertRupiah()
	}

	const _getFlagColor = (flag) => {
		switch (flag) {
			case 0:
				return null
			case 1:
				return ColorsList.danger
			case 2:
				return ColorsList.success
			default:
				return null
		}
	}

	return <Container>
		<ModalMonth {...ctrl} />
		<GlobalHeader
			title="Laporan"
			renderLeftAccessory={() => null}
			renderRightAccessory={() => <IconHeader onPress={() => ctrl.setVisible(true)} name="calendar" />}
		/>
		<Body>
			<View style={{ marginBottom: SizeList.base }}>
				<SelectBoxModal
					closeOnSelect noLabel
					height={200}
					value={MainTab.routes[MainTab.index].title}
					data={MainTab.routes}
					handleChangePicker={(a, i) => MainTab.setIndex(i)}
					renderItem={item => <Text font="SemiBold">{item.title.toUpperCase()}</Text>}
				/>
			</View>
			<ViewShadow noPadding title={moment(dateSelected).format('MMMM YYYY')}>
				<Wrapper style={{ marginVertical: SizeList.base }} >
					<View>
						<Text>Total Penjualan</Text>
						<Wrapper>
							<Text color={_getFlagColor(dataTransaction.penjualan_flag)} >{_convertRupiah(dataTransaction, 'total_penjualan')}</Text>
							{dataTransaction.penjualan_flag != 0 &&
								<Icon
									size={15}
									name={dataTransaction.penjualan_flag == 2 ? "sort-up" : "sort-down"}
									color={_getFlagColor(dataTransaction.penjualan_flag)}
								/>
							}
						</Wrapper>
					</View>
					<View>
						<Text>Total Keuntungan</Text>
						<Wrapper>
							<Text color={_getFlagColor(dataTransaction.profit_flag)} >{_convertRupiah(dataTransaction, 'total_profit')}</Text>
							{dataTransaction.profit_flag != 0 &&
								<Icon
									size={15}
									name={dataTransaction.profit_flag == 2 ? "sort-up" : "sort-down"}
									color={_getFlagColor(dataTransaction.profit_flag)}
								/>
							}
						</Wrapper>
					</View>
				</Wrapper>
				<Divider />
				<Wrapper style={{ marginVertical: SizeList.base }} >
					<View>
						<Text align="center">Transaksi</Text>
						<Text align="center" color="primary">{dataTransaction && dataTransaction.jumlah_transaksi}</Text>
					</View>
					<View>
						<Text align="center">Produk Terjual</Text>
						<Text align="center" color="primary">{dataTransaction && dataTransaction.produk_terjual}</Text>
					</View>
				</Wrapper>
			</ViewShadow>
			<ViewShadow title="Laporan keuangan" noPadding>
				{
					dataTransaction &&
					['total_penjualan', 'penjualan_kotor', 'discount', 'total_return', 'penjualan_bersih', 'pajak', 'service_charge']
						.rMap((key, i) => <Wrapper key={i.toString()} style={{ margin: 10 }} spaceBetween>
							<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
							<Text color={i == 0 && 'primary'}>{_convertRupiah(dataTransaction, key)}</Text>
						</Wrapper>)
				}
			</ViewShadow>
			<ViewShadow noPadding title="Laporan laba/rugi kotor">
				{
					dataTransaction &&
					['total_penjualan', 'penjualan_kotor', 'discount', 'total_return', 'penjualan_bersih', 'pajak', 'harga_pokok_penjualan']
						.rMap((key, i) => <Wrapper key={i.toString()} style={{ padding: 10 }} spaceBetween>
							<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
							<Text color={i == 0 && 'primary'}>{_convertRupiah(dataTransaction, key)}</Text>
						</Wrapper>)
				}
			</ViewShadow>
			<Text>Laporan non tunai</Text>
			<SelectBoxModal
				closeOnSelect noLabel
				style={{ marginTop: SizeList.base }}
				value={NT && NT.selected ? NT.selected.method : ''}
				data={dataReportNonTunai}
				handleChangePicker={selected => setNT({ selected })}
				renderItem={item => <Text font="SemiBold" color={NT.selected && NT.selected.method == item.method ? 'primary' : 'greyFontHard'}>{item.method.toUpperCase()}</Text>}
			/>
			<ViewShadow noPadding noTitle>
				{
					NT && NT.selected && ['penjualan_bersih', 'penjualan_kotor', 'diskon', 'pembatalan', 'pajak'].rMap((key, i) => (
						<Wrapper key={i.toString()} style={{ padding: 10 }} spaceBetween>
							<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
							<Text color={i == 0 && 'primary'}>{_convertRupiah(NT.selected, key)}</Text>
						</Wrapper>
					))
				}
			</ViewShadow>
			{
				dataReportCategory && dataReportCategory.rMap(({ harga, data, nama_category }, index) => (
					<ViewShadow noPadding noTitle={index != 0} title="Laporan penjualan">
						<Text style={{ paddingVertical: SizeList.base }} align="center">{!nama_category ? 'PESANAN MANUAL' : nama_category.toUpperCase()}</Text>
						<Divider style={{ marginVertical: SizeList.secondary }} />
						{
							data && data.length > 0 ? data.rMap(({ Product, harga_jual, total, jumlah }, i) => <Wrapper style={{ marginBottom: SizeList.secondary, paddingVertical: SizeList.secondary }} spaceBetween>
								<View>
									<Text>{Product}</Text>
									<Text>{harga_jual.convertRupiah()} x {jumlah}</Text>
								</View>
								<Text _flexStart>{total.convertRupiah()}</Text>
							</Wrapper>) : <Text>Tidak ada data penjualan</Text>
						}
					</ViewShadow>
				))
			}
		</Body>
	</Container >
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
		}}>TERAPKAN</Button>
	</Modal >
}