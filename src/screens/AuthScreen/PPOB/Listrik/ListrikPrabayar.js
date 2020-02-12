import React, { useState } from 'react';
import Container, { ContainerBody } from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { $Padding, $Margin } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ListrikPrabayar = ({ navigation }) => {
	const [phoneNumber, setPhoneNumber] = useState()
	const [selected, setSelected] = useState()
	const _selectPulsa = ({ item, index }) => {
		setSelected(index)
	}
	const data = [{ a: 'Nama Pelanggan', b: 'Albert Stanley' }, { a: 'ID Pelanggan', b: '1234567 ' }]
	return <Container>
		<GlobalHeader onPressBack={() => navigation.goBack()} title="Prabayar" />
		<View style={styles.topComp}>
			<MDInput _width="80%"
				label="ID Pelanggan"
				value={phoneNumber}
				onChangeText={text => setPhoneNumber(text)}
			/>
		</View>
		<TouchableOpacity style={styles.cekTagihan}>
			<Text color="primary">CEK TAGIHAN</Text>
		</TouchableOpacity>
		<ContainerBody style={{ padding: 0 }}>
			<View style={{ ...$Margin(0, 15), borderRadius: 5, backgroundColor: ColorsList.whiteColor }}>
				{data.map((item, i) => [
					<Wrapper justify="space-between" style={{ padding: 10 }}>
						<Text font="Regular">{item.a}</Text>
						<Text font="Regular">{item.b}</Text>
					</Wrapper>,
					i != data.length - 1 && <Divider />
				])}
			</View>
		</ContainerBody>
		<Bottom>
			<Button width="100%" wrapper={{ justify: 'space-between' }}>
				<Wrapper>
					<Icon name="shopping-cart" color={ColorsList.whiteColor} />
					<Text style={{ marginLeft: 5 }} color="white">Belanja 1 Produk</Text>
				</Wrapper>
				<Wrapper _width="40%">
					<Divider color={ColorsList.whiteColor} height="100%" />
					<Text color="white">Rp. 2.500</Text>
				</Wrapper>
			</Button>
		</Bottom>
	</Container >
}
export default ListrikPrabayar