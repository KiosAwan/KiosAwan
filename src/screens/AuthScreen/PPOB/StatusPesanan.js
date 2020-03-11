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
		if (navigation.state.params.params) {
			setParams(navigation.state.params.params)
		}
	}, [])

	const wrapper = {
		justify: 'space-between',
		style: { padding: 10 }
	}
	const { details, payment, transaction } = params

	const _checkData = (key, isCondition) => {
		let data = transaction ? transaction[key] : ''
		return isCondition ? Boolean(data) : data
	}

	return <Container onlyTitle header={{ title: 'Status Pesanan' }}>
		<Body>
			{
				_checkData('status') === 'PENDING' ?
					<Button disabled color="warning" wrapper={{ justify: 'flex-start' }}>
						<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
						<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi sedang diproses!</Text>
					</Button>
					:
					<Button disabled color="success" wrapper={{ justify: 'flex-start' }}>
						<Icon color={ColorsList.whiteColor} name="exclamation-circle" />
						<Text color="whiteColor" style={{ paddingHorizontal: 10 }}>Transaksi berhasil!</Text>
					</Button>
			}
			<View style={{ backgroundColor: ColorsList.whiteColor, borderRadius: 5, marginTop: 15 }}>
				<Wrapper {...wrapper}>
					<View>
						<Text color="primary" size={16}>{_checkData('transaction_name').split('_').join(' ').toUpperCase()}</Text>
						<Text>{_checkData('customerID')}</Text>
					</View>
					{
						transaction && transaction.tagihan == 0 ?
							<View/> :
							<Text>{convertRupiah(parseInt(_checkData('tagihan')))}</Text>
					}
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Kode Transaksi</Text>
					<Text>{_checkData('transaction_code')}</Text>
				</Wrapper>
				<Divider />
				{_checkData('customer_name', true) && [
					<Wrapper {...wrapper}>
						<Text>Nama Pelanggan</Text>
						<Text>{_checkData('customer_name').trim()}</Text>
					</Wrapper>,
					<Divider />
				]}
				<Wrapper {...wrapper}>
					<Text>Tanggal Transaksi</Text>
					<Text>{moment(_checkData('date')).format('MM / YYYY')}</Text>
				</Wrapper>
				<Divider />
				<Wrapper {...wrapper}>
					<Text>Biaya Admin</Text>
					<Text>{convertRupiah(parseInt(_checkData('admin')))}</Text>
				</Wrapper>
				<Divider />
				{_checkData('denda', true) && [
					<Wrapper {...wrapper}>
						<Text>Denda</Text>
						<Text>{convertRupiah(parseInt(_checkData('denda')))}</Text>
					</Wrapper>,
					<Divider />
				]}
				<Wrapper {...wrapper}>
					<Text>Total Tagihan</Text>
					<Text>{convertRupiah(parseInt(_checkData('total')))}</Text>
				</Wrapper>
			</View>
		</Body>
		<Footer>
			<Button onPress={() => navigation.navigate('/ppob')}>LANJUT</Button>
		</Footer>
	</Container>
}
export default StatusPesanan