import React, { useState } from "react"
import { Image, View } from "react-native"
import Container, { Body } from "src/components/View/Container"
import { Text } from "src/components/Text/CustomText"
import DropdownSelect from "src/components/Picker/Dropdown"
import Icon from "react-native-vector-icons/FontAwesome5"
import { Wrapper } from "src/components/View/Wrapper"
import { ColorsList } from "src/styles/colors"
import MDInput from "src/components/Input/MDInput"
import Divider from "src/components/Row/Divider"
import { Bottom } from "src/components/View/Bottom"
import { Button } from "src/components/Button/Button"

const AsuransiTipus = ({ navigation }) => {
	const [selected, setSelected] = useState()
	const [detailOn, setDetailOn] = useState(false)
	return (
		<Container
			header={{
				title: "Tipus",
				onPressBack: () => navigation.goBack(),
			}}>
			<Body style={{ padding: 10, borderRadius: 5 }}>
				<Wrapper justify="flex-start">
					<Image
						style={{ height: 30, width: 70, resizeMode: "contain" }}
						source={require("src/assets/icons/ppob/topup/BNI.png")}
					/>
					<Icon
						style={{ marginLeft: 20 }}
						color={ColorsList.greyFont}
						onPress={() => setDetailOn(!detailOn)}
						size={15}
						name={detailOn ? "chevron-up" : "chevron-down"}
					/>
				</Wrapper>
				{detailOn && (
					<View style={{ marginTop: 15 }}>
						<Text>
							Sunt veniam et tempor sunt sit ullamco id eiusmod ea culpa. Et
							veniam consequat nostrud velit mollit exercitation aute
							consectetur aute veniam veniam tempor et sit.
						</Text>
						<Text>
							Sunt veniam et tempor sunt sit ullamco id eiusmod ea culpa. Et
							veniam consequat nostrud velit mollit exercitation aute
							consectetur aute veniam veniam tempor et sit.
						</Text>
					</View>
				)}
				<View
					style={{
						marginTop: 15,
						backgroundColor: ColorsList.whiteColor,
						borderRadius: 5,
						padding: 10,
					}}>
					<MDInput label="Nama Lengkap" />
					<MDInput label="No. Handphone" />
					<MDInput label="No. KTP" />
					<MDInput label="Tanggal Lahir" />
					<MDInput label="Alamat" />
					<DropdownSelect
						data={[1, 2, 3, 4, 5]}
						renderItem={({ item, index }) => {
							return <Text>{item}</Text>
						}}
						value={selected}
						onSelect={({ item }) => setSelected(item)}
						placeholder="Jenis Kelamin"
					/>
					<DropdownSelect
						data={[1, 2, 3, 4, 5]}
						renderItem={({ item, index }) => {
							return [
								<Text>{item}</Text>,
								<Text>{item}</Text>,
								<Text>{item}</Text>,
							]
						}}
						value={selected}
						onSelect={({ item }) => setSelected(item)}
						placeholder="Periode"
					/>
				</View>
				<View
					style={{
						marginVertical: 15,
						backgroundColor: ColorsList.whiteColor,
						borderRadius: 5,
					}}>
					{[1, 2, 3, 4].rMap((item, i) => [
						<Wrapper justify="space-between" style={{ margin: 10 }}>
							<Text>Nama Pelanggan</Text>
							<Text>Albert Stanley</Text>
						</Wrapper>,
						i != 3 && <Divider />,
					])}
				</View>
			</Body>
		</Container>
	)
}
export default AsuransiTipus
