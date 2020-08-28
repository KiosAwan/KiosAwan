import React, { Component } from "react"
import { Text } from "src/components/Text/CustomText"
import Container, { Body } from "src/components/View/Container"
import { Button } from "src/components/Button/Button"
import { $Padding } from "src/utils/stylehelper"
import { Wrapper } from "src/components/View/Wrapper"
import { ColorsList } from "src/styles/colors"
import { SizeList } from "src/styles/size"
import { useSelector } from "react-redux"

const Manajemen = ({ navigation }) => {
	const ListManajemen = require("src/assets/json/manajemen.json")
	const User = useSelector(state => state.User)
	return (
		<Container>
			<Text style={{ marginTop: 15 }} font="SemiBold" align="center">
				MANAJEMEN
			</Text>
			<Body>
				<Text style={{ marginBottom: 10 }}>Pilih modul yang akan dikelola</Text>
				{ListManajemen.rMap((menu, i) => {
					return (
						<Button
							onPress={() => {
								if (User.store) {
									navigation.navigate(menu.route)
								}
							}}
							style={{
								borderRadius: 5,
								marginBottom: 10,
								borderWidth: SizeList.borderWidth,
								borderColor: ColorsList.borderColor,
							}}
							padding={$Padding(5, 10)}
							wrapper={{ justify: "flex-start" }}
							color={["whiteColor", "greyFont"]}>
							<Wrapper width="100%" justify="space-between">
								<Text>{menu.name}</Text>
							</Wrapper>
						</Button>
					)
				})}
			</Body>
		</Container>
	)
}

export default Manajemen
