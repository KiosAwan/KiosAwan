import React, { Component, useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Image, TouchableOpacity, FlatList } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { Wrapper, Button } from 'src/components/Button/ButtonComp';
import { ColorsList } from 'src/styles/colors';
import { ImageText } from 'src/components/Card/CardComp';
import moment from 'moment';
import { Icon } from 'native-base';
import { FloatingInput } from 'src/components/Input/InputComp';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactionList } from 'src/redux/actions/actionsTransactionList';
import { convertRupiah } from '../../../../utils/authhelper';

const TransactionDetailHutang = ({ navigation }) => {
	const dispatch = useDispatch()
	const [filterPopup, setFilterPopup] = useState(false)
	const DataTransaksi = useSelector(state => state.Transaction)
	const User = useSelector(state => state.User)
	const [search, setSearch] = useState('')
	const filterResult = (data) => {
		return data
			.filter(item => item.status_payment.includes('2'))
			.filter(item => item.name_customer.toLowerCase().includes(search))
	}
	console.debug(JSON.stringify(DataTransaksi))
	useEffect(() => {
		dispatch(getTransactionList(User.store.id_store))
	}, [])
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader onPressBack={() => navigation.goBack()} title="Daftar Hutang" />
			<AwanPopup.Menu visible={filterPopup} title="FILTER" backdropDismiss={() => setFilterPopup(false)}>
				<TouchableOpacity>
					<Text>Semua</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Lunas</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Hutang</Text>
				</TouchableOpacity>
				<TouchableOpacity>
					<Text>Dibatalkan</Text>
				</TouchableOpacity>
			</AwanPopup.Menu>
			<View style={{ backgroundColor: ColorsList.whiteColor, padding: 15 }}>
				<FloatingInput label="Cari produk" labelStyle={{ left: '8%' }}>
					<Icon style={{ color: ColorsList.primary }} name="search" />
					<TextInput style={{ width: '92%' }} value={search} onChangeText={text => setSearch(text)} />
				</FloatingInput>
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
					<View style={{ alignItems: 'center' }}>
						<Image style={{ width: 350, height: 350 }} source={require('src/assets/images/no-transaction.png')} />
						<View style={{ alignItems: 'center' }}>
							<Text font="ExtraBold" size={17}>Anda belum memiliki piutang</Text>
							<Text>Silahkan lalukan transaksi baru untuk mengisi laporan</Text>
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