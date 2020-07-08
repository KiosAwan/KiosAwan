import React, { useEffect, useState, Fragment } from 'react'
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
import { convertRupiah } from 'src/utils/authhelper'
import Divider from 'src/components/Row/Divider'

const ListTransaksiPPOB = ({ navigation }) => {
	const [filter, setFilter] = stateObject()
	const [listTransaction, setListTransaction] = useState({})
	const [loading, setLoading] = useState(true)
	const [nextPage, setNextPage] = useState(1)
	const [totalPage, setTotalPage] = useState(1)
	const _selectDate = tanggal => {
		let date = moment(tanggal).format('YYYY-MM-DD')
		setFilter({ dateOpen: false, date })
		_getData({ ...filter, date })
	}
	const _getData = async (param, page) => {
		const { status, data } = await getPPOBTransactionList(param || filter, page)
		let dataResult = []
		if (status == 200) {
			if (nextPage == 1) {
				dataResult = data.data
			} else {
				dataResult = [...listTransaction, ...data.data]
			}
			setNextPage(parseInt(data.current_page) + 1)
			setTotalPage(parseInt(data.total_pages))
			setListTransaction(dataResult)
			setLoading(false)
		} else {
			setListTransaction(dataResult)
			setLoading(false)
		}
	}

	const _addMoreData = async () => {
		if (parseInt(nextPage) <= parseInt(totalPage)) {
			_getData(null, nextPage)
		}
	}
	useEffect(() => {
		_getData(null, 1)
		setFilter({})
	}, [])
	return <Container header={{
		title: "List Transaksi PPOB",
		onPressBack: () => navigation.goBack()
	}}>
		<DateTimePicker
			isVisible={filter.dateOpen}
			onConfirm={_selectDate}
			onCancel={() => setFilter({ dateOpen: false })}
		/>
		<View style={{ flex: 1, padding: SizeList.bodyPadding }}>
			{
				loading ?
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
						<ActivityIndicator color={ColorsList.primary} />
					</View>
					:
					<View style={{ flex: 1 }}>
						{
							listTransaction.length == 0 ?
								<View style={{ flex: 1, alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
									<Image style={{ resizeMode: 'contain', width: 200, height: 200 }} source={require("src/assets/images/riwayat.png")} />
									<Text size={16}>Tidak ada transaksi</Text>
								</View>
								:
								<FlatList
									data={listTransaction}
									showsVerticalScrollIndicator={false}
									onEndReached={_addMoreData}
									onEndReachedThreshold={0.25}
									renderItem={({ item }) => {
										const { transaction_name, customerID, customer_name, transaction_code, total, date } = item
										return <Fragment>
											<Button onPress={() => navigation.navigate(`/drawer/transaction/detail/digital`, { param: item.id })}
												style={{ borderRadius: SizeList.borderRadius }}
												color={["white"]}
												spaceBetween
											>
												<View>
													<Wrapper justify="space-between">
														<Text _width="65%" font="SemiBold" color="primary">{transaction_name.toString().toUpperCase().split('_').join(' ')}</Text>
														<Text _width="35%" align="right" color="greyFontHard">{convertRupiah(total)}</Text>
													</Wrapper>
													<Text color="greyFontHard">{customerID}</Text>
													<Text color="greyFontHard">{customer_name}</Text>
													<Wrapper justify="space-between" style={{ marginTop: 10 }}>
														<Text>{transaction_code}</Text>
														<Text>{date}</Text>
													</Wrapper>
												</View>
											</Button>
											<Divider />
										</Fragment>
									}
									}
									keyExtractor={(item, i) => i.toString()}
								/>
						}
					</View>
			}
		</View>
	</Container>
}

export default ListTransaksiPPOB
