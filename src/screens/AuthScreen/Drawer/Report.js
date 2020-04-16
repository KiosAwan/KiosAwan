import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText';
import { convertRupiah } from 'src/utils/authhelper';
import { AwanPopup, Dropdown, Modal } from 'src/components/ModalContent/Popups';
import { useSelector } from 'react-redux';
import { getTransactionData, getReportCategory, getReportNonTunai } from 'src/utils/authhelper'
import moment from 'moment';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import { RowChild } from 'src/components/Helper/RowChild';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Container, { Body } from 'src/components/View/Container';
import { TabView } from 'react-native-tab-view';
import { stateObject } from 'src/utils/state';
import { $BorderRadius } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { SizeList } from 'src/styles/size';
import { SelectBoxModal } from 'src/components/Picker/SelectBoxModal';

const Report = ({ navigation }) => {
	const [data, setData] = stateObject({
		dataTransaction: {},
		dataReportCategory: [],
		dataReportNonTunai: []
	})
	const { dataTransaction, dataReportCategory, dataReportNonTunai } = data
	const User = useSelector(state => state.User)
	const GetData = async param => {
		const { data: dataTransaction } = await getTransactionData(User.store.id_store, param)
		const { data: dataReportCategory } = await getReportCategory(User.store.id_store, param)
		const { data: dataReportNonTunai } = await getReportNonTunai(User.store.id_store)
		setData({ dataTransaction, dataReportCategory, dataReportNonTunai })
		console.debug(JSON.stringify(dataReportNonTunai))
	}

	useEffect(() => {
		GetData({})
	}, [])

	let format = 'YYYY-MM-DD'
	const header = {
		title: "Laporan",
		image: require('src/assets/icons/filter.png'),
		onPressBack: () => navigation.goBack(),
		onPressIcon: () => {
			setController({ visible: true })
			// const { from, to } = _filterData('2022-04')
			// setController({ filter: { date: [from, to] } })
		}
	}
	const _filterData = date => {
		date = moment(date)
		const [from, to] = [date.startOf('month').format(format), date.endOf('month').format(format)]
		return { from, to }
	}
	const [NT, setNT] = stateObject()
	const [controller, setController] = stateObject({
		setVisible: visible => setController({ visible }),
		setFilter: date => console.debug(date),
		visible: false,
		filter: {
			date: [moment().startOf('month').format(format), moment().endOf('month').format(format)],
		}
	})
	const [MainTab, setMainTab] = stateObject({
		index: 0,
		routes: [
			{ key: 'first', title: 'Semua' },
			// { key: 'second', title: 'Penjualan Produk' },
			// { key: 'third', title: 'Penjualan PPOB' }
		],
		initialLayout: { width: 300, height: 300 },
		setIndex: index => setMainTab({ index })
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
									<Text size={17} color="primary">{'1500000'.convertRupiah()}</Text>
								</View>
								<Button onPress={() => setController({ dataTransaction: !controller.dataTransaction })} color="link">DETAIL</Button>
							</Wrapper>
							{
								controller.dataTransaction && Object.keys(dataTransaction).map((key, i) => <Wrapper style={{ padding: 10 }} spaceBetween>
									<Text>{key}</Text>
									<Text>{dataTransaction[key]}</Text>
								</Wrapper>)
							}
						</View>
						<View style={{ backgroundColor: ColorsList.white, marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Ringkasan Laporan Laba/Rugi Kotor</Text>
							<Divider />
							<Wrapper style={{ padding: 10 }} spaceBetween>
								<View>
									<Text>Total Pendapatan</Text>
									<Text size={17} color="primary">{'800000'.convertRupiah()}</Text>
								</View>
								<Button color="link">DETAIL</Button>
							</Wrapper>
						</View>
						<View style={{ backgroundColor: ColorsList.white, marginBottom: 10, borderRadius: 5 }}>
							<Text style={{ padding: 10 }}>Ringkasan Laporan Non Tunai</Text>
							<Divider />
							<SelectBoxModal
								closeOnSelect
								label="Filter Data"
								data={dataReportNonTunai}
								value={NT.selected.method}
								handleChangePicker={selected => setNT({ selected })}
								renderItem={item => <Text color={NT.selected && NT.selected.method == item.method ? 'primary' : 'greyFont'}>{item.method}</Text>}
								style={{ paddingHorizontal: 10 }}
							/>
							<Wrapper style={{ padding: 10 }} spaceBetween>
								<View>
									<Text>Total Pendapatan</Text>
									<Text size={17} color="primary">{'1500000'.convertRupiah()}</Text>
								</View>
								<Button color="link">DETAIL</Button>
							</Wrapper>
						</View>
					</View> :
					<View style={{ backgroundColor: ColorsList.white }}>
						{
							dataReportCategory.map(({ harga, data, nama_category }) => <View>
								<Text style={{ backgroundColor: ColorsList.greyAuthHard, padding: 10 }} font={nama_category ? 'Regular' : 'Italic'} align="center">{nama_category ? nama_category : '~ Pesanan Manual ~'}</Text>
								{
									data.map(({ Product, harga_jual, total, jumlah }, i) => [
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
						<Text color="primary" size={17} align="center">{'1500000'.convertRupiah()}</Text>
						<Text align="center">Total Penjualan</Text>
					</View>
					<Divider flex />
					<View style={{ padding: 10 }}>
						<Text color="primary" size={17} align="center">{'300000'.convertRupiah()}</Text>
						<Text align="center">Total Keuntungan</Text>
					</View>
				</Wrapper>
				<Divider />
				<Wrapper spaceBetween style={{ padding: 10 }}>
					<Text>Transaksi</Text>
					<Text color="primary">74</Text>
				</Wrapper>
				<Divider />
				<Wrapper spaceBetween style={{ padding: 10 }}>
					<Text>Produk Terjual</Text>
					<Text color="primary">68</Text>
				</Wrapper>
			</View>
			<TabView
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
		<ModalMonth {...controller} />
		<TabView
			renderTabBar={({ navigationState }) => {
				const { index, routes, setIndex } = navigationState
				return <View>
					<Wrapper style={{ padding: 15 }} flexContent>
						{
							routes.map((route, i) => {
								return <Button
									textStyle={{ fontSize: 12 }}
									disabled={index == i}
									onPress={() => setIndex(i)}
									active={index == i}
									color="white"
									activeColor="primary"
									noRadius
									style={{
										...i == 0 && $BorderRadius(5, 0, 0, 5),
										...i == routes.length - 1 && $BorderRadius(0, 5, 5, 0)
									}}
								>{route.title}</Button>
							})
						}
					</Wrapper>
					<Text style={{ paddingHorizontal: 15, paddingBottom: 10 }}>Desember 2019</Text>
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
			setFilter({
				date: `${filter.year}-${filter.month.toString().length == 1 ? '0' : ''}${filter.month + 1}`,
				text: bulan[month] + year
			})
			setVisible(false)
		}} color="white">TERAPKAN</Button>
	</Modal >
}