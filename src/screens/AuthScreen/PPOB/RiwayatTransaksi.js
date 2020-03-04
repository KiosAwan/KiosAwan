import React, { useEffect } from 'react';
import { View, FlatList, Image } from 'react-native';
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
		await dispatch(getRiwayatTransaksi(userToken, userId))
	}
	return RiwayatTransaksi.isLoading ? <Text>Loading</Text>
		:
		<Container>
			<GlobalHeader title="Riwayat" onPressBack={() => navigation.goBack()} />
			<Body>
				<FlatList
					data={RiwayatTransaksi.data}
					renderItem={({ item }) => <Wrapper justify="space-between" style={{ borderRadius: 5, padding: 10, marginBottom: 5, backgroundColor: ColorsList.whiteColor }}>
						<Image _width="15%" style={{ resizeMode: 'contain', width: null, height: 50 }} source={require('src/assets/icons/ppob/pulsa.png')} />
						<View _width="55%">
							<Text font="ExtraBold" color="primary">{item.payment_channel}</Text>
							<Text font="ExtraBold">{item.trx_id}</Text>
							<Text>{moment(item.created_at).format('DD MMM YYYY HH:mm')}</Text>
						</View>
						<Text align="right" _justify="flex-end" _width="25%">{convertRupiah(item.amount)}</Text>
					</Wrapper>
					}
					keyExtractor={(item, i) => i.toString()}
				/>
			</Body>
		</Container>
}

export default RiwayatTransaksi;