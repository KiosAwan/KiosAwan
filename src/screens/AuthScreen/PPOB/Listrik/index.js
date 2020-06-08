import React, { useState } from 'react';
import Container, { Body } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { Image } from 'src/components/CustomImage';
import { SizeList } from 'src/styles/size';

const PpobListrik = ({ navigation }) => {
	return <Container header={{
		title: "Listrik",
		onPressBack: () => navigation.goBack(),
	}}>
		<Body>
			<Text style={{marginBottom : 10}}>Pilih jenis pembayaran listrik</Text>
			{[
				{ screen: "pln_prepaid", title: "Token Listrik" },
				{ screen: "pln_postpaid", title: "Tagihan Listrik" },
				{ screen: "pln_non_tagihan_listrik", title: "Non Tagihan Listrik" }
			].rMap((item, i) => <Button
				key={i}
				onPress={() => navigation.navigate(`/ppob/${item.screen}`)}
				style={{ marginBottom: 5, borderRadius : SizeList.borderRadius }}
				padding={$Padding(5, 10)}
				wrapper={{ justify: 'flex-start' }}
				color={['whiteColor']}>
				<Image width="13%" size={30} source={require('src/assets/icons/ppob/PLN.png')} />
				<Wrapper width="87%" justify="space-between">
					<Text>{item.title}</Text>
				</Wrapper>
			</Button>)}
		</Body>
	</Container>
}
export default PpobListrik