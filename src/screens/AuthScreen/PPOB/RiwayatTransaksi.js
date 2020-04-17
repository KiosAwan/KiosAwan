import React, { useEffect } from 'react';
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

const RiwayatTransaksi = ({ navigation }) => {
	const dispatch = useDispatch()
	const RiwayatTransaksi = useSelector(state => state.RiwayatTransaksi)

	useEffect(() => {
		_getRiwayat()
	}, [])

	const _getRiwayat = async () => {
		const userToken = await getUserToken()
		const userId = await getUserId()
		dispatch(getRiwayatTransaksi(userToken, userId))
	}
	return RiwayatTransaksi.isLoading ? <ActivityIndicator color={ColorsList.primary} />
		:
		<Container>
			<GlobalHeader title="Riwayat" onPressBack={() => navigation.goBack()} />
			{RiwayatTransaksi.data.length == 0 ?
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center", width: "70%", alignSelf: "center" }}>
					<Image style={{ resizeMode: 'contain', width: 250, height: 250 }} source={require("src/assets/images/riwayat.png")} />
					<Text font="Bold" size={16}>Anda belum memiliki riwayat</Text>
					<Text style={{ marginTop: 20 }} align="center">Silahkan lakukan topup atau pembelian produk pulsa dan tagihan</Text>
				</View>
				:
				<Body>
					<FlatList
						data={RiwayatTransaksi.data}
						renderItem={({ item }) => <Wrapper justify="space-between" style={{ borderRadius: 5, padding: 10, marginBottom: 5, backgroundColor: ColorsList.whiteColor }}>
							<Image _width="15%" style={{ resizeMode: 'contain', width: null, height: 50 }} source={require('src/assets/icons/ppob/pulsa.png')} />
							<View _width="80%">
								<Wrapper justify="space-between">
									<Text font="SemiBold" color="primary">{item.transaction_name.split('_').join(' ').toUpperCase()}</Text>
									<Text size={12} color={item.type == 0 ? "success" : "danger"}>{`${item.type == 0 ? "+" : "-"} ${convertRupiah(item.amount)}`}</Text>
								</Wrapper>
								<Text color="primary" color="#3e3d3d">{item.customer_id}</Text>
								<Wrapper justify="space-between" style={{marginTop : 10}}>
									<Text size={12}>{item.transaction_code}</Text>
									<Text size={12}>{moment(item.created_at).format('DD MMM YYYY HH:mm')}</Text>
								</Wrapper>
							</View>
						</Wrapper>
						}
						keyExtractor={(item, i) => i.toString()}
					/>
				</Body>
			}
		</Container>
}

export default RiwayatTransaksi;