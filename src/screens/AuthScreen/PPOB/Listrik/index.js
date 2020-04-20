import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { Image } from 'src/components/CustomImage';
import { Modal } from 'src/components/ModalContent/Popups';
import SearchInput from 'src/components/Input/SearchInput';
import Divider from 'src/components/Row/Divider';
import { View, ScrollView } from 'react-native';

const PpobListrik = ({ navigation }) => {
	const [modal, setModal] = useState(false)
	return <Container header={{
		title: "Listrik",
		// image: require('src/assets/icons/phonebook.png'),
		// onPressIcon: () => setModal(true),
		onPressBack: () => navigation.goBack(),
	}}>
		<Modal backdropDismiss={() => setModal(false)} visible={modal}>
			<View>
				<Text size={17} align="center">Nomor Pelanggan</Text>
				<SearchInput textInput={{
					placeholder: 'Cari nomor'
				}} />
				<ScrollView persistentScrollbar style={{ maxHeight: 250, marginTop: 10 }}>
					{[1, 2, 3, 4, 5, 6]
						.map((item, i) => [
							<Button color="link">Albert Stanley - 123456789123456789</Button>,
							i != 5 && <Divider />
						])
					}
				</ScrollView>
			</View>
		</Modal>
		<Body>
			{[
				{ screen: "token", title: "Listrik Prepaid / Token" },
				{ screen: "prabayar", title: "Listrik Postpaid" },
				{ screen: "ntl", title: "Non Tagihan Listrik" }
			].map((item, i) => <Button
				key={i}
				onPress={() => navigation.navigate(`/ppob/listrik/${item.screen}`)}
				style={{ marginBottom: 5 }}
				padding={$Padding(5, 10)}
				wrapper={{ justify: 'flex-start' }}
				color={['whiteColor']}>
				<Image width="13%" size={30} source={require('src/assets/icons/ppob/PLN.png')} />
				<Wrapper width="87%" justify="space-between">
					<Text>{item.title}</Text>
					<Image size={20} source={require('src/assets/icons/next.png')} />
				</Wrapper>
			</Button>)}
		</Body>
	</Container>
}
export default PpobListrik