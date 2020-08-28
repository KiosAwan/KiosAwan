import React, { useState } from "react"
import Container, { Body } from "src/components/View/Container"
import { Wrapper } from "src/components/View/Wrapper"
import styles from "./TVStyle"
import { GlobalHeader } from "src/components/Header/Header"
import { Text } from "src/components/Text/CustomText"
import Divider from "src/components/Row/Divider"
import { Button } from "src/components/Button/Button"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { $Padding, $Margin } from "src/utils/stylehelper"
import { ColorsList } from "src/styles/colors"
import { Image } from "src/components/CustomImage"
import MDInput from "src/components/Input/MDInput"
import { Bottom, BottomVertical } from "src/components/View/Bottom"
import Icon from "react-native-vector-icons/FontAwesome5"
import { AwanPopup, Modal } from "src/components/ModalContent/Popups"
import { SizeList } from "src/styles/size"
import SearchInput from "src/components/Input/SearchInput"
import SwitchButton from "src/components/Button/SwitchButton"

const TVKabel = ({ navigation }) => {
	const [idPelanggan, setIdPelanggan] = useState(123123)
	const [selected, setSelected] = useState()
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const [nativeEvent, setNativeEvent] = useState({})
	const _layout = ({ nativeEvent }) => {
		setNativeEvent(nativeEvent)
	}
	const _selectMonth = () => {
		setSelected({ index: 1, name: "Januari 2020" })
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
				title: "TV Kabel",
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
				<TouchableOpacity
					onLayout={_layout}
					onPress={() => setDropdownVisible(true)}>
					<View style={styles.selectContainer}>
						<Wrapper justify="space-between" style={styles.selectWrapper}>
							<Text size={16}>
								{selected ? selected.name : "Pembayaran sampai"}
							</Text>
							<Icon color={ColorsList.greyFont} size={15} name="chevron-down" />
						</Wrapper>
					</View>
				</TouchableOpacity>
				<AwanPopup.Menu
					noTitle
					transparent
					absolute
					visible={dropdownVisible}
					backdropDismiss={() => setDropdownVisible(false)}
					style={
						(styles.dropdownStyle,
						{
							width: "100%",
							top:
								Object.keys(nativeEvent).length > 0
									? nativeEvent.layout.y + nativeEvent.layout.height * 2 + 20
									: 80,
						})
					}
					contentStyle={[styles.dropdownContentStyle]}>
					{[1, 2].rMap((item, i) => [
						<Button
							onPress={_selectMonth}
							key={i}
							width="100%"
							wrapper={{ justify: "flex-start" }}
							key={i}
							justify="space-between"
							color="link">
							<Text>{i}</Text>
							<Text>Pilihan nya ada berapa makan</Text>
						</Button>,
						<Divider />,
					])}
				</AwanPopup.Menu>
				<MDInput
					_width="80%"
					label="ID Pelanggan"
					value={idPelanggan.toString()}
					onChangeText={text => setVirtualNumber(text)}
				/>
			</View>
			<View style={styles.simpan}>
				<Text>Simpan VA ini untuk masuk ke favorit</Text>
				<SwitchButton
					// handleChangeToggle={_handleChangeToggle}
					toggleValue={true}
				/>
			</View>
			<Body style={{ padding: 0 }}>
				<View
					style={{
						...$Margin(0, 15),
						borderRadius: 5,
						backgroundColor: ColorsList.whiteColor,
					}}>
					{data.rMap((item, i) => [
						<Wrapper key={i} justify="space-between" style={{ padding: 10 }}>
							<Text font="Regular">{item.a}</Text>
							<Text font="Regular">{item.b}</Text>
						</Wrapper>,
						i != data.length - 1 && <Divider />,
					])}
				</View>
			</Body>
			<BottomVertical>
				<Button onPress={() => {}} color="white" width="100%">
					CEK TAGIHAN
				</Button>
				<Button style={{ marginTop: 5 }} onPress={() => {}} width="100%">
					SIMPAN
				</Button>
			</BottomVertical>
		</Container>
	)
}
export default TVKabel
