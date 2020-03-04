import React, { useState } from 'react';
import Container from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import MDInput from 'src/components/Input/MDInput';
import { Bottom, BottomVertical } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { checkListrikToken } from 'src/utils/api/ppob/listrik_api';
import { ColorsList } from 'src/styles/colors';
import { useDispatch } from 'react-redux';
import { AddPPOBToCart } from 'src/redux/actions/actionsPPOB';

const ListrikToken = ({ navigation }) => {
	//Initialize dispatch
	const dispatch = useDispatch()
	const [custId, setCustId] = useState(32127971177)
	const [selected, setSelected] = useState()

	//Loading state
	const [loading, setLoading] = useState(false)
	//Response after checking tagihan
	const [response, setResponse] = useState()
	const _selectPulsa = ({ item, index }) => {
		setSelected(index)
	}

	const _cekTagihan = async () => {
		setLoading(true)
		const data = {
			productID: 100302,
			customerID: custId
		}
		//Checking the customer ID to server
		const res = await checkListrikToken(data)
		setLoading(false)
		//Set the response data to state
		if (res.status == 200) {
			setResponse(res.data)
		} else {
			setResponse([])
		}
	}

	const _onPressSimpan = async () => {
		if (response) {
			const data = { type: "pln_prepaid", customerID: response.transaction.customerID, productID: 100302, price: 30000, productName: "TOKEN LISTRIK" }
			dispatch(AddPPOBToCart(data))
			navigation.goBack()
		} else {
			alert("Harap cek nomor token terlebih dahulu")
		}
	}
	return <Container>
		<GlobalHeader onPressBack={() => navigation.goBack()} title="Token" />
		<View style={styles.topComp}>
			<MDInput _width="80%"
				label="ID Pelanggan"
				value={custId}
				onChangeText={text => setCustId(text)}
			/>
		</View>
		{loading ?
			<View style={styles.custInfo}>
				<ActivityIndicator color={ColorsList.primary} />
			</View>
			:
			response ?
				<View style={styles.custInfo}>
					{response.length == 0 ?
						<Text color="danger">DATA PELANGGAN TIDAK DITEMUKAN</Text>
						:
						<View>
							<Wrapper justify="space-between">
								<Text font="Regular">Nama Pelanggan</Text>
								<Text font="Regular">{response.transaction.nama}</Text>
							</Wrapper>
							<Wrapper justify="space-between">
								<Text font="Regular">Daya Listrik</Text>
								<Text font="Regular">{parseInt(response.transaction.daya)} VA</Text>
							</Wrapper>
						</View>
					}
				</View>
				: null
		}
		<FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
			showsVerticalScrollIndicator={false}
			data={response ? [1, 2] : []}
			renderItem={({ item, index }) =>
				<TouchableOpacity onPress={() => _selectPulsa({ item, index })} style={[styles.pulsaWrapper, index === selected && styles.pulsaWrapperActive]}>
					<Text style={styles.pulsaComp}>Reguler</Text>
					<Text color="primary" size={20} style={styles.pulsaComp}>Rp. 5.000</Text>
					<Divider />
					<Text style={styles.pulsaComp}>Harga: Rp. 5.925</Text>
				</TouchableOpacity>
			}
		/>
		<BottomVertical>
			<Button onPress={_cekTagihan} color="white" width="100%">
				CEK TAGIHAN
            </Button>
			<Button style={{ marginTop: 5 }} onPress={_onPressSimpan} width="100%">
				SIMPAN
            </Button>
		</BottomVertical>
	</Container>
}
export default ListrikToken