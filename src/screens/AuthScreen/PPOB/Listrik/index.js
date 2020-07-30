import React, { useState, useEffect } from 'react';
import Container, { Body } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { Image } from 'src/components/CustomImage';
import { SizeList } from 'src/styles/size';
import { getProductPPOBGeneral } from 'src/utils/api/ppobapi';
import { View } from 'react-native';

const PpobListrik = ({ navigation }) => {
	const [product, setProduct] = useState([])
	useEffect(() => {
		_getProduct()
	}, [])

	const _getProduct = async () => {
		const res = await getProductPPOBGeneral("listrik")
		setProduct(res.data)
	}
	return <Container header={{
		title: "Listrik",
		onPressBack: () => navigation.goBack(),
	}}>
		<Body>
			<Text style={{ marginBottom: 10 }}>Pilih jenis pembayaran listrik</Text>
			{product.rMap((item, i) => <View>
				<Button
					key={i}
					onPress={() => item.status == 1 ? navigation.navigate(`/ppob/${item.type}`) : {}}
					style={{ marginBottom: 5, borderRadius: SizeList.borderRadius }}
					padding={$Padding(5, 10)}
					wrapper={{ justify: 'flex-start' }}
					color={['whiteColor']}>
					<Image width="13%" size={30} source={require('src/assets/icons/ppob/PLN.png')} />
					<Wrapper width="60%" justify="space-between">
						<Text>{item.product_name}</Text>
					</Wrapper>
					{item.status != 1 && <Text _width="27%" color={item.status == 0 ? "primary" : "warning"} >{item.status == 0 ? "Soon" : "Maintenance"}</Text>}
				</Button>
			</View>)}
		</Body>
	</Container>
}
export default PpobListrik