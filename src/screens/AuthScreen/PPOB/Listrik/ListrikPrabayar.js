import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, ActivityIndicator } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import MDInput from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import { checkTagihanListrik } from 'src/utils/api/ppob/listrik_api';
import { convertRupiah } from 'src/utils/authhelper';
import SwitchButton from 'src/components/Button/SwitchButton';
import { useDispatch } from 'react-redux';
import { AddPPOBToCart } from 'src/redux/actions/actionsPPOB';

const ListrikPrabayar = ({ navigation }) => {
	const dispatch = useDispatch()
	const [custId, setCustId] = useState(112000026979)
	const [selected, setSelected] = useState()
	//Data tagihan
	const [tagihanLoading, setTagihanLoading] = useState(false)
	const [tagihanData, setTagihanData] = useState()
    const [modal, setModal] = useState(false)

	//Function for check tagihan
	const _cekTagihan = async () => {
		setTagihanLoading(true)
		const data = {
			productID: 100301,
			customerID: custId
		}
		const res = await checkTagihanListrik(data)
		setTagihanLoading(false)
		if (res.status == 400) {
			alert(res.data.errors.msg)
		} else {
			setTagihanData(res.data)
		}
	}

	//Function for add product to cart
	const _onPressSimpan = async () => {
		if (tagihanData) {
			const data = { type: "pln_postpaid", customerID: tagihanData.transaction.customerID, productID: 100301, price: tagihanData.transaction.total, productName: "TAGIHAN PLN" }
			dispatch(AddPPOBToCart(data))
			navigation.goBack()
		} else {
			alert("Harap cek tagihan terlebih dahulu")
		}
	}
	return <Container header={{
		title: "Listrik Prabayar",
		image: require('src/assets/icons/phonebook.png'),
		onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
		<View style={styles.topComp}>
			<MDInput _width="80%"
				label="ID Pelanggan"
				value={custId}
				onChangeText={text => setCustId(text)}
			/>
		</View>
		<View style={styles.simpan}>
			<Text>Simpan VA ini untuk masuk ke favorit</Text>
			<SwitchButton
				// handleChangeToggle={_handleChangeToggle}
				toggleValue={true}
			/>
		</View>
		{tagihanLoading ? <ActivityIndicator color={ColorsList.primary} />
			:
			tagihanData ?
				<Body style={{ padding: 0, marginBottom: 120 }}>
					<View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Nama Pelanggan</Text>
							<Text font="Regular">{tagihanData.transaction.nama}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Id Pelanggan</Text>
							<Text font="Regular">{tagihanData.transaction.customerID}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Jumlah Tagihan</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.tagihan)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Denda</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.denda)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Admin</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.admin)}</Text>
						</Wrapper>
						<Divider />
						<Wrapper justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">Total Tagihan</Text>
							<Text font="Regular">{convertRupiah(tagihanData.transaction.total)}</Text>
						</Wrapper>
					</View>
				</Body>
				: null}
		<BottomVertical>
			<Button onPress={_cekTagihan} color="white" width="100%">
				CEK TAGIHAN
            </Button>
			<Button style={{ marginTop: 5 }} onPress={_onPressSimpan} width="100%">
				SIMPAN
            </Button>
		</BottomVertical>
	</Container >
}
export default ListrikPrabayar