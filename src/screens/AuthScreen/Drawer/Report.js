import React, { useState, useEffect } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
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
import { Image } from 'src/components/CustomImage';
import { BottomSheet } from 'src/components/Picker/BottomSheetSelect';
import DateRangePicker from 'src/components/Picker/DateRangePicker';
const ViewShadow = props => <View style={{ marginBottom: SizeList.base, padding: props.noPadding ? 0 : SizeList.padding, }}>
	{!props.noTitle && <Text style={{ marginBottom: props.noMargin ? 10 : 0 }}>{props.title}</Text>}
	<View {...props} style={[{ marginTop: props.noMargin ? 0 : SizeList.base }, shadowStyle, props.style]} />
</View>

const Report = ({ navigation }) => {
	const [firstOpen, setFirstOpen] = useState(true)
	const [filterData, setFilterData] = useState({})
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
	const [NT, setNT] = stateObject()
	const _convertRupiah = (data, key) => {
		let value = !data ? '' : data[key] || 0
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
	const _handleRefresh = async () => {
		if (User.store) {
			GetData(filterData)
		}
	}

	const [dateRange, setDateRange] = useState([])
	const initRange = date => {
		const format = 'YYYY-MM-DD'
		const [startDate, endDate] = date ? date.map(a => moment(a)) : [moment().startOf('month'), moment().endOf('month')]
		return [startDate.format(format), endDate.format(format)]
	}
	const [SelectBox, setSelectBox] = stateObject({
		index: 0,
		data: ['Semua Laporan', 'Penjualan Produk', 'Penjualan PPOB']
	})
	const setFilter = ({ from, to, index }) => {
		let tipe_product = index == 1 ? 'product' : index == 2 ? 'ppob' : ''
		GetData({ from, to, tipe_product })
		setFilterData({ from, to, tipe_product })
	}
	return <Container>
		<GlobalHeader
			title="Laporan"
			renderLeftAccessory={() => null}
			renderRightAccessory={() => <BottomSheet
				height={425}
				renderButton={<IconHeader disabled name="calendar" />}
				content={close => <DateRangePicker
					initialRange={initRange(dateRange.length > 0 ? dateRange : undefined)}
					onSuccess={(from, to) => {
						setFilter({ from, to, index: SelectBox.index })
						setDateRange([from, to])
						close()
					}}
				/>}
			/>}
		/>
		<Body refreshControl={<RefreshControl refreshing={false} onRefresh={_handleRefresh} />}>
			{!User.store ?
				<View style={{ alignItems: 'center', }}>
					<Image style={{ width: 250, height: 250 }} source={require('src/assets/images/no-transaction.png')} />
					<View style={{ padding: 20, alignItems: 'center' }}>
						<Text font="SemiBold" size={17}>Anda belum memiliki transaksi</Text>
						<Text align="center">Silahkan melalukan transaksi baru untuk mengisi laporan</Text>
					</View>
				</View>
				:
				<View>
					<View style={{ marginBottom: SizeList.base }}>
						<SelectBoxModal
							closeOnSelect noLabel
							height={170}
							value={SelectBox.data[SelectBox.index]}
							data={SelectBox.data}
							handleChangePicker={(a, index) => {
								const [from, to] = initRange(dateRange.length > 0 ? dateRange : undefined)
								setSelectBox({ index })
								setFilter({ from, to, index })
							}}
							renderItem={(title, i) => <Text color={i == SelectBox.index ? 'primary' : 'greyFont'} font="SemiBold">{title.toUpperCase()}</Text>}
						/>
					</View>
					<ViewShadow noPadding title={initRange(dateRange.length > 0 ? dateRange : undefined).map(date => {
						const currentDate = moment(date).format('DD MMM YYYY')
						return currentDate
					}).join(' - ')}>
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
							['total_penjualan', 'penjualan_kotor', 'discount', 'total_return', 'penjualan_bersih',
								// 'pajak', 'service_charge'
							]
								.rMap((key, i) => <Wrapper key={i.toString()} style={{ margin: 10 }} spaceBetween>
									<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
									<Text color={i == 0 && 'primary'}>{_convertRupiah(dataTransaction, key)}</Text>
								</Wrapper>)
						}
					</ViewShadow>
					<ViewShadow noPadding title="Laporan laba/rugi kotor">
						{
							dataTransaction &&
							['total_penjualan', 'penjualan_kotor', 'discount', 'total_return',
								'penjualan_bersih',
								// 'pajak',
								'harga_pokok_penjualan'
							]
								.rMap((key, i) => <Wrapper key={i.toString()} style={{ padding: 10 }} spaceBetween>
									<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
									<Text color={i == 0 && 'primary'}>{_convertRupiah(dataTransaction, key)}</Text>
								</Wrapper>)
						}
					</ViewShadow>
					<Text style={{ marginBottom: SizeList.base }}>Laporan non tunai</Text>
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
							NT && NT.selected && ['penjualan_bersih', 'penjualan_kotor', 'diskon', 'pembatalan',
								// 'pajak'
							].rMap((key, i) => (
								<Wrapper key={i.toString()} style={{ padding: 10 }} spaceBetween>
									<Text color={i == 0 && 'primary'}>{key.split('_').join(' ').ucwords()}</Text>
									<Text color={i == 0 && 'primary'}>{_convertRupiah(NT.selected, key)}</Text>
								</Wrapper>
							))
						}
					</ViewShadow>
					{
						dataReportCategory && dataReportCategory.rMap(({ harga, data, nama_category }, index) => (
							<ViewShadow noMargin noPadding noTitle={index != 0} title="Laporan penjualan">
								<Text style={{ paddingVertical: SizeList.base }} align="center">{!nama_category ? 'PESANAN MANUAL' : nama_category.toUpperCase()}</Text>
								<Divider style={{ marginVertical: SizeList.secondary }} />
								{
									data && data.length > 0 ? data.rMap(({ Product, harga_jual, total, jumlah }, i) => <Wrapper style={{ marginBottom: SizeList.secondary, paddingVertical: SizeList.secondary }} spaceBetween>
										<View _width="68%">
											<Text>{Product}</Text>
											<Text>{harga_jual.convertRupiah()} x {jumlah}</Text>
										</View>
										<Text _width="30%" _flexStart align="right">{total.convertRupiah()}</Text>
									</Wrapper>) : <Text>Tidak ada data penjualan</Text>
								}
							</ViewShadow>
						))
					}
				</View>
			}
		</Body>
	</Container >
}

export default Report