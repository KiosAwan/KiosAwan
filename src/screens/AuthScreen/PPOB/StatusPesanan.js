import React, { useEffect, useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ColorsList } from 'src/styles/colors';
import { View } from 'react-native';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Border } from 'src/utils/stylehelper';
import Divider from 'src/components/Row/Divider';
import { convertRupiah } from 'src/utils/authhelper';
import moment from 'moment';

const StatusPesanan = ({ navigation }) => {

	const [params, setParams] = useState({
		details: null,
		payment: null,
		transaction: null
	})

	useEffect(() => {
		if (navigation.state.params) {
			console.debug(navigation.state.params)
			setParams(navigation.state.params)
		}
	}, [])

	const wrapper = {
		justify: 'space-between',
		style: { padding: 10 }
	}
	const { details, payment, transaction } = params

	return <Container onlyTitle header={{ title: 'Status Pesanan' }}>
		<Body>
			<Button disabled color="success" wrapper={{ justify: 'flex-start' }}>
				<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
				<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi berhasil!</Text>
			</Button>
			<Button disabled color="warning" wrapper={{ justify: 'flex-start' }}>
				<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
				<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi sedang diproses!</Text>
			</Button>
			<View style={{ backgroundColor: ColorsList.whiteColor, borderRadius: 5, marginTop: 15 }}>
				<Wrapper {...wrapper}>
					<View>
						<Text color="primary" size={16}>Lorem</Text>
						<Text>{987654332}</Text>
					</View>
					<Text>{convertRupiah(103000)}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Nama Pelanggan</Text>
					<Text>{'Albert Stanley'}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>No. Jastel</Text>
					<Text>{123456789}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Divre / datel</Text>
					<Text>{moment().format('MM / YYYY')}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Total Tagihan</Text>
					<Text>{convertRupiah(100000)}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Biaya Pembayaran</Text>
					<Text>{convertRupiah(3000)}</Text>
				</Wrapper>
			</View>
		</Body>
		<Footer>
			<Button onPress={() => navigation.navigate('/ppob')}>LANJUT</Button>
		</Footer>
	</Container>
}
export default StatusPesanan