import React, { useEffect, useState, Fragment } from "react"
import { View, FlatList } from "react-native"
import Container, { Body, BodyFlatList } from "src/components/View/Container"
import { GlobalHeader } from "src/components/Header/Header"
import { Button } from "src/components/Button/Button"
import { $Padding } from "src/utils/stylehelper"
import { Image } from "src/components/CustomImage"
import { Wrapper } from "src/components/View/Wrapper"
import { Text } from "src/components/Text/CustomText"
import { getListProducts } from "src/utils/api/setupharga"
import { DEV_IMG_URL } from "src/config"
import { stylesglobe } from "src/styles/globalStyle"
import Divider from "src/components/Row/Divider"
import { SizeList } from "src/styles/size"

const SettingHargaPPOB = ({ navigation }) => {
	const [listProducts, setListProducts] = useState()
	const _getData = async () => {
		const { status, data } = await getListProducts()
		if (status == 200) {
			setListProducts(data)
		} else {
			setListProducts([])
		}
	}
	useEffect(() => {
		_getData()
	}, [])
	return (
		<Container>
			<GlobalHeader
				title="Atur Harga"
				onPressBack={() => navigation.goBack()}
			/>
			<Body>
				{listProducts && listProducts.length > 0 && (
					<View style={[stylesglobe.shadowView]}>
						<BodyFlatList
							style={{ marginVertical: SizeList.base }}
							data={listProducts}
							renderItem={({ item, index }) => (
								<Fragment>
									<Button
										onPress={() =>
											navigation.navigate(`/ppob/settings/sub-product`, item)
										}
										wrapper={{ justify: "flex-start" }}
										color={["whiteColor", "greyFont"]}>
										<Image
											width="13%"
											size={25}
											source={{ uri: `${item.image}` }}
										/>
										<Wrapper width="87%" justify="space-between">
											<Text>{item.product}</Text>
											<Image
												size={20}
												source={require("src/assets/icons/next.png")}
											/>
										</Wrapper>
									</Button>
									{index != listProducts.length - 1 && (
										<Divider style={{ marginVertical: SizeList.secondary }} />
									)}
								</Fragment>
							)}
							keyExtractor={(item, i) => i.toString()}
						/>
					</View>
				)}
			</Body>
		</Container>
	)
}

export default SettingHargaPPOB
