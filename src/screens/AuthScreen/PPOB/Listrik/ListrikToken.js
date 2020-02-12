import React, { useState } from 'react';
import Container from 'src/components/View/Container';
import styles from './ListrikStyle';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { $Padding } from 'src/utils/stylehelper';
import { ColorsList } from 'src/styles/colors';
import { Image } from 'src/components/CustomImage';
import MDInput from 'src/components/Input/MDInput';
import { Bottom } from 'src/components/View/Bottom';
import Icon from 'react-native-vector-icons/FontAwesome5';

const ListrikToken = ({ navigation }) => {
	const [phoneNumber, setPhoneNumber] = useState()
	const [selected, setSelected] = useState()
	const _selectPulsa = ({ item, index }) => {
		setSelected(index)
	}
	return <Container>
		<GlobalHeader onPressBack={() => navigation.goBack()} title="Token" />
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
		<FlatList style={styles.listPulsa} numColumns={2} keyExtractor={(a, i) => i.toString()}
			showsVerticalScrollIndicator={false}
			data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
			renderItem={({ item, index }) =>
				<TouchableOpacity onPress={() => _selectPulsa({ item, index })} style={[styles.pulsaWrapper, index === selected && styles.pulsaWrapperActive]}>
					<Text style={styles.pulsaComp}>Reguler</Text>
					<Text color="primary" size={20} style={styles.pulsaComp}>Rp. 5.000</Text>
					<Divider />
					<Text style={styles.pulsaComp}>Harga: Rp. 5.925</Text>
				</TouchableOpacity>
			}
		/>
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
	</Container>
}
export default ListrikToken