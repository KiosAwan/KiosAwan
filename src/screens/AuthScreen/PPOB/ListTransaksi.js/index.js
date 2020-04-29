import React, { useEffect, useState } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import Container, { Body } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { Button } from 'src/components/Button/Button'
import { $Padding } from 'src/utils/stylehelper'
import { Image } from 'src/components/CustomImage'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import { getPPOBTransactionList } from 'src/utils/api/setupharga'
import { DEV_IMG_URL } from 'src/config'
import { ColorsList } from 'src/styles/colors'
import moment from 'moment'
import SearchInput from 'src/components/Input/SearchInput'
import { stateObject } from 'src/utils/state'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { SizeList } from 'src/styles/size'
import DateTimePicker from 'react-native-modal-datetime-picker'

const ListTransaksiPPOB = ({ navigation }) => {
	const [filter, setFilter] = stateObject()
	const [listTransaction, setListTransaction] = useState({})
	const [loading, setLoading] = useState(true)
	const _selectDate = tanggal => {
		let date = moment(tanggal).format('YYYY-MM-DD')
		setFilter({ dateOpen: false, date })
		_getData({ ...filter, date })
	}
	const _getData = async param => {
		console.debug(param)
		const { status, data } = await getPPOBTransactionList(param || filter)
		if (status == 200) {
			setListTransaction(data)
			setLoading(false)
		} else {
			setListTransaction([])
			setLoading(false)
		}
	}
	useEffect(() => {
		_getData()
		setFilter({})
	}, [])
	return <Container>
		<GlobalHeader onPressIcon={() => setFilter({ dateOpen: true })} onPressBack={() => navigation.goBack()} image={require('src/assets/icons/filter.png')}>
			{
				filter.searchOpen ?
					<SearchInput
						textInput={{
							value: filter.search,
							style: { color: ColorsList.white },
							ref: ref => ref && ref.focus(),
							onBlur: () => setFilter({ searchOpen: false }),
							onChangeText: search => setFilter({ search }),
						}}
						clear={() => setFilter({ search: '' })}
						color={ColorsList.white} icon={require('src/assets/icons/circlerejectwhite.png')}
					/> :
					<Wrapper spaceBetween>
						<Text color="white">List Transaksi PPOB</Text>
						<Button padding={0} color="link" onPress={() => setFilter({ searchOpen: true })}>
							<Icon size={20} color={ColorsList.white} name="search" />
						</Button>
					</Wrapper>
			}
		</GlobalHeader>
		<DateTimePicker
			isVisible={filter.dateOpen}
			onConfirm={_selectDate}
			onCancel={() => setFilter({ dateOpen: false })}
		/>
		<Body style={{ padding: 0 }}>
			{
				loading ?
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
						<ActivityIndicator color={ColorsList.primary} />
					</View> :
					Object.keys(listTransaction).length > 0 ?
						Object.keys(listTransaction).map((key, dateIndex) => {
							const { tanggal, data } = listTransaction[key]
							const filteredData = () => !filter.search ? data : data
								.filter(({ transaction_name, customerID, customer_name }) => {
									let dataFilter = [transaction_name, customerID, customer_name]
										.map(val => val && val.toString().toLowerCase().includes(filter.search))
									return dataFilter.includes(true)
								})
							return <View key={dateIndex.toString()}>
								<Text style={{ backgroundColor: ColorsList.white, padding: SizeList.bodyPadding, marginBottom: 5 }}>{tanggal}</Text>
								{
									filteredData().map((item, i) => {
										const { transaction_name, customerID, customer_name, image } = item
										return <Button onPress={() => navigation.navigate(`/drawer/transaction/detail/digital`, { param: data.id })} style={{ marginHorizontal: SizeList.padding, marginBottom: 5 }} color={["white"]} key={i.toString()} spaceBetween>
											<Image _width="10%" size={30} source={{ uri: `${DEV_IMG_URL}/${image}` }} />
											<View _width="70%">
												<Text color="primary">{transaction_name.toString().toUpperCase().split('_').join(' ')}</Text>
												<Text>{customerID}</Text>
												<Text size={10}>{customer_name}</Text>
											</View>
											<Image _width="10%" size={20} source={require('src/assets/icons/next.png')} />
										</Button>
									})
								}
							</View>
						}) : <View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
							<Image style={{ resizeMode: 'contain', width: 250, height: 250 }} source={require("src/assets/images/riwayat.png")} />
							<Text font="Bold" size={16}>Tidak ada transaksi</Text>
						</View>
			}
		</Body>
	</Container>
}

export default ListTransaksiPPOB
