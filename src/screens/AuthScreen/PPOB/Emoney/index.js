import React, { useState } from "react"
import Container, { Body } from "src/components/View/Container"
import styles from "./EmoneyStyle"
import { Wrapper } from "src/components/View/Wrapper"
import { GlobalHeader } from "src/components/Header/Header"
import { Text } from "src/components/Text/CustomText"
import Divider from "src/components/Row/Divider"
import { Button } from "src/components/Button/Button"
import { View, TouchableOpacity, FlatList, ScrollView } from "react-native"
import { $Padding, $Margin } from "src/utils/stylehelper"
import { ColorsList } from "src/styles/colors"
import { Image } from "src/components/CustomImage"
import MDInput from "src/components/Input/MDInput"
import { Bottom } from "src/components/View/Bottom"
import Icon from "react-native-vector-icons/FontAwesome5"
import { AwanPopup, Modal } from "src/components/ModalContent/Popups"
import { SizeList } from "src/styles/size"
import { convertRupiah } from "src/utils/authhelper"
import SearchInput from "src/components/Input/SearchInput"

const Emoney = ({ navigation }) => {
	const [phoneNumber, setPhoneNumber] = useState(123123)
	const [selected, setSelected] = useState()
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const [nativeEvent, setNativeEvent] = useState({})
	const _layout = ({ nativeEvent }) => {
		setNativeEvent(nativeEvent)
	}
	const _selectMonth = () => {
		setSelected({ index: 1, name: "Gopay" })
		setDropdownVisible(false)
	}
	const data = [
		{ a: "Nama Pelanggan", b: "Albert Stanley" },
		{ a: "ID Pelanggan", b: "1234567 " },
	]
	const [modal, setModal] = useState(false)
	return (
		<Container
			header={{
				title: "E-Money",
				image: require("src/assets/icons/phonebook.png"),
				onPressIcon: () => setModal(true),
				onPressBack: () => navigation.goBack(),
			}}>
			<Modal backdropDismiss={() => setModal(false)} visible={modal}>
				<View>
					<Text size={17} align="center">
						Nomor Pelanggan
					</Text>
					<SearchInput
						textInput={{
							placeholder: "Cari nomor",
						}}
					/>
					<ScrollView
						persistentScrollbar
						style={{ maxHeight: 250, marginTop: 10 }}>
						{[1, 2, 3, 4, 5, 6].rMap((item, i) => [
							<Button color="link">Albert Stanley - 123456789123456789</Button>,
							i != 5 && <Divider />,
						])}
					</ScrollView>
				</View>
			</Modal>
			<View style={styles.topComp}>
				<View onLayout={_layout}>
					<TouchableOpacity onPress={() => setDropdownVisible(true)}>
						<View style={styles.selectContainer}>
							<Wrapper justify="space-between" style={styles.selectWrapper}>
								<Text size={16}>
									{selected ? selected.name : "Pilih E-Money"}
								</Text>
								<Icon
									color={ColorsList.greyFont}
									size={15}
									name="chevron-down"
								/>
							</Wrapper>
						</View>
					</TouchableOpacity>
				</View>
				<AwanPopup.Menu
					noTitle
					transparent
					absolute
					visible={dropdownVisible}
					backdropDismiss={() => setDropdownVisible(false)}
					style={[
						styles.dropdownStyle,
						{
							width: "100%",
							top:
								Object.keys(nativeEvent).length > 0
									? nativeEvent.layout.y + nativeEvent.layout.height * 2 + 20
									: 200,
						},
					]}
					contentStyle={[styles.dropdownContentStyle]}>
					{[1, 2].rMap((item, i) => [
						<Button
							onPress={_selectMonth}
							key={i}
							width={SizeList.width}
							wrapper={{ justify: "flex-start" }}
							key={i}
							justify="space-between"
							color="link">
							<Text>{i}</Text>
							<Text>Gopay</Text>
						</Button>,
						<Divider />,
					])}
				</AwanPopup.Menu>
				<MDInput
					_width="80%"
					label="No Handphone"
					value={phoneNumber.toString()}
					onChangeText={text => setPhoneNumber(text)}
				/>
			</View>
			<Body style={{ padding: 0 }}>
				<FlatList
					style={styles.listPulsa}
					numColumns={2}
					keyExtractor={(a, i) => i.toString()}
					showsVerticalScrollIndicator={false}
					data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							onPress={() => _selectPulsa({ item, index })}
							style={[
								styles.pulsaWrapper,
								index === selected && styles.pulsaWrapperActive,
							]}>
							<Text style={styles.pulsaComp}>Gopay</Text>
							<Text color="primary" size={20} style={styles.pulsaComp}>
								{convertRupiah(20000)}
							</Text>
							<Divider />
							<Text style={styles.pulsaComp}>
								Harga: {convertRupiah(21000)}
							</Text>
						</TouchableOpacity>
					)}
				/>
			</Body>
			<Bottom>
				<Button width="100%" wrapper={{ justify: "space-between" }}>
					<Wrapper>
						<Icon name="shopping-cart" color={ColorsList.whiteColor} />
						<Text style={{ marginLeft: 5 }} color="white">
							Belanja 1 Produk
						</Text>
					</Wrapper>
					<Wrapper _width="40%">
						<Divider color={ColorsList.whiteColor} height="100%" />
						<Text color="white">Rp. 2.500</Text>
					</Wrapper>
				</Button>
			</Bottom>
		</Container>
	)
}
export default Emoney
