import moment from 'moment';
import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { ImageText } from 'src/components/Card/CardComp';
import { Icon } from 'native-base';
import { } from 'src/components/Input/InputComp';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { convertRupiah } from 'src/utils/authhelper';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import MDInput from 'src/components/Input/MDInput';

const TransactionDetailHutang = ({ navigation }) => {
	const dispatch = useDispatch()
	const [filterPopup, setFilterPopup] = useState(false)
	const DataTransaksi = useSelector(state => state.Transaction)
	const User = useSelector(state => state.User)
	const [search, setSearch] = useState('')
	const filterResult = (data) => {
		return data
			.filter(item => item.status_payment.includes('2'))
			.filter(item => `${item.name_customer.toLowerCase()}${item.payment_code.toLowerCase()}`.includes(search))
	}
	console.debug(JSON.stringify(DataTransaksi))
	useEffect(() => {
		dispatch(getTransactionList(User.store.id_store))
	}, [])


	const menuProps = {
		color: "link", style: { padding: 0 }, textProps: { font: 'Regular' }, align: "flex-start"
	}

	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader onPressBack={() => navigation.goBack()} title="Daftar Hutang" />
			<AwanPopup.Menu visible={filterPopup} title="FILTER" backdropDismiss={() => setFilterPopup(false)}>
				<Button {...menuProps}>Semua</Button>
				<Button {...menuProps}>Lunas</Button>
				<Button {...menuProps}>Hutang</Button>
				<Button {...menuProps}>Dibatalkan</Button>
			</AwanPopup.Menu>
			<View style={{ backgroundColor: ColorsList.whiteColor, padding: 15 }}>
				<MDInput label="Cari transaksi" left={30}
					renderLeftAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
					style={{ width: '92%' }} value={search} onChangeText={text => setSearch(text)} />
			</View>
			<View style={{ flex: 1, padding: 15 }}>
				{
					eval(DataTransaksi.data.map(item => filterResult(item.data).length).join('+')) > 0 ?
						<FlatList
							data={DataTransaksi.data}
							showsVerticalScrollIndicator={false}
							keyExtractor={(item, index) => index.toString()}
							renderItem={({ item }) => {
								return filterResult(item.data).map(trx => {
									return <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/detail', { transactionId: trx.id_transaction })}>
										<Wrapper style={styles.wrapper} justify="space-between">
											<Wrapper>
												<ImageText size={60} name={trx.name_customer} />
												<View style={[styles.centering, { paddingLeft: 15 }]}>
													<Text color="primary" font={trx.name_customer ? 'ExtraBold' : 'ExtraBoldItalic'}>{trx.name_customer ? trx.name_customer : 'Tidak ada Pelanggan'}</Text>
													<Text>{moment(trx.created_at).format('ddd, DD MMM YYYY')}</Text>
												</View>
											</Wrapper>
											<View style={styles.centering}>
												<Icon name={moment(new Date().setHours(0, 0, 0, 0)).unix() > moment(trx.due_debt_date).unix() ? 'alert' : null} style={{ alignSelf: 'flex-end', color: ColorsList.warning }} />
												<Text font="ExtraBold" color="primary">{convertRupiah(trx.total_transaction)}</Text>
											</View>
										</Wrapper>
									</TouchableOpacity>
								})
							}}
						/>
						:
						<View style={{ alignItems: 'center', width: '75%' }}>
							<Image style={{ width: 250, height: 250, marginTop: 50 }} source={require('src/assets/images/no-transaction.png')} />
							<View style={{ alignItems: 'center' }}>
								<Text font="ExtraBold" size={17}>Anda belum memiliki piutang!</Text>
								<Text align="center">Silahkan lalukan transaksi baru untuk mengisi laporan.</Text>
							</View>
						</View>
				}
			</View>
		</View >
	)
}

export default TransactionDetailHutang

const styles = StyleSheet.create({
	wrapper: { padding: 15, backgroundColor: ColorsList.whiteColor, marginBottom: 5 },
	centering: { justifyContent: 'center' }
})