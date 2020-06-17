import React, { useEffect, Fragment } from 'react';
import { View, FlatList, Image, ActivityIndicator } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { useSelector, useDispatch } from 'react-redux';
import { getRiwayatTransaksi } from 'src/redux/actions/actionsRiwayatTransaksi';
import { getUserToken, getUserId, convertRupiah } from 'src/utils/authhelper';
import { Text } from 'src/components/Text/CustomText';
import { ColorsList } from 'src/styles/colors';
import moment from 'moment';
import { Wrapper } from 'src/components/View/Wrapper';
import Container, { Body } from 'src/components/View/Container';
import { DEV_IMG_URL } from 'src/config';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';

const RiwayatTransaksi = ({ navigation }) => {
	const dispatch = useDispatch()
	const RiwayatTransaksi = useSelector(state => state.RiwayatTransaksi)
	useEffect(() => {
		_getRiwayat()
	}, [])

	const _getRiwayat = async (pageNum) => {
		const userToken = await getUserToken()
		const userId = await getUserId()
		const page = pageNum || 1
		dispatch(getRiwayatTransaksi(userToken, userId, page))
	}

	const _addMoreData = async () => {
		if (parseInt(RiwayatTransaksi.nextPage) < parseInt(RiwayatTransaksi.total)) {
			_getRiwayat(RiwayatTransaksi.nextPage)
		}
	}

	return <Container>
		<GlobalHeader title="Riwayat" onPressBack={() => navigation.goBack()} />
		{RiwayatTransaksi.isLoading ? <View style={{ flex: 1, justifyContent: 'center' }} >
			<ActivityIndicator color={ColorsList.primary} />
		</View>
			:
			RiwayatTransaksi.data.length == 0 ?
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
					<Image style={{ resizeMode: 'contain', width: 250, height: 250 }} source={require("src/assets/images/riwayat.png")} />
					<Text font="Bold" size={16}>Anda belum memiliki riwayat</Text>
					<Text style={{ marginTop: 20 }} align="center">Silahkan lakukan topup atau pembelian produk pulsa dan tagihan</Text>
				</View>
				:
				// Don't use body Component here, it make the lazy load didn't work
				<View style={{ padding: SizeList.bodyPadding, flex: 1 }}>
					<View style={{ borderRadius: 5, padding: SizeList.padding, backgroundColor: ColorsList.whiteColor }}>
						<FlatList
							onEndReached={_addMoreData}
							onEndReachedThreshold={0.25}
							showsVerticalScrollIndicator={false}
							data={RiwayatTransaksi.data}
							renderItem={({ item }) => <Fragment>
								<Wrapper justify="space-between">
									<View _width="100%">
										<Wrapper justify="space-between">
											<Text _width="65%" font="SemiBold" color="primary">{item.transaction_name && item.transaction_name.split('_').join(' ').toUpperCase()}</Text>
											<Text _width="35%" align="right" color={item.type == 0 ? "success" : "danger"}>{`${item.type == 0 ? "+" : "-"} ${convertRupiah(item.amount)}`}</Text>
										</Wrapper>
										<Text color="greyFontHard">{item.customer_id}</Text>
										<Wrapper justify="space-between" style={{ marginTop: 15 }}>
											<Text>{item.transaction_code}</Text>
											<Text>{moment(item.created_at).format('DD MMM YYYY HH:mm')}</Text>
										</Wrapper>
									</View>
								</Wrapper>
								<Divider style={{ marginVertical: 10 }} />
							</Fragment>
							}
							keyExtractor={(item, i) => i.toString()}
						/>
					</View>
				</View>
		}
	</Container>
}

export default RiwayatTransaksi;