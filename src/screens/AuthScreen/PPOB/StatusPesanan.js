import React, { useEffect, useState } from 'react';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ColorsList } from 'src/styles/colors';
import { View, Image } from 'react-native';
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
							<View /> :
							<Text>{convertRupiah(parseInt(_checkData('total')))}</Text>
					}
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
					<Text>{moment(_checkData('date')).format('DD MMM YYYY - hh:mm')}</Text>
				</Wrapper>
				<Divider />
				{_checkData('tagihan', true) && [
					<Wrapper {...wrapper}>
						<Text>Total Tagihan</Text>
						<Text>{convertRupiah(parseInt(_checkData('tagihan')))}</Text>
					</Wrapper>,
					<Divider />
				]}
				{_checkData('admin', true) && [
					<Wrapper {...wrapper}>
						<Text>Biaya Pembayaran</Text>
						<Text>{convertRupiah(parseInt(_checkData('admin')))}</Text>
					</Wrapper>,
					<Divider />
				]}
				{_checkData('denda', true) && [
					<Wrapper {...wrapper}>
						<Text>Denda</Text>
						<Text>{convertRupiah(parseInt(_checkData('denda')))}</Text>
					</Wrapper>,
					<Divider />
				]}
				<Wrapper {...wrapper}>
					<Text font="ExtraBold">Total Tagihan</Text>
					<Text font="ExtraBold">{convertRupiah(parseInt(_checkData('total')))}</Text>
				</Wrapper>
			</View>
		</Body>
		<Footer>
			<Wrapper justify="space-between">
				<Button wrapper={{ justify: 'center' }} color="white" _width="49.5%" onPress={() => navigation.navigate('/ppob')}>
					<Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/plus-primary.png')} />
					<Text color="primary">TAMBAH PRODUK</Text>
				</Button>
				<Button wrapper={{ justify: 'center' }} color="white" _width="49.5%" onPress={() => { }}>
					<Image _style={{ marginRight: 10 }} style={{ height: 18, width: 18 }} source={require('src/assets/icons/print-primary.png')} />
					<Text color="primary">CETAK STRUK</Text>
				</Button>
			</Wrapper>
			<Button onPress={() => navigation.navigate('/ppob')}>LANJUT</Button>
		</Footer>
	</Container>
}
export default StatusPesanan