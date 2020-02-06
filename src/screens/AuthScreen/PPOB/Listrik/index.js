import React, { useState } from 'react';
import Container, { ContainerBody } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';
import { GlobalHeader } from 'src/components/Header/Header';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { Image } from 'src/components/CustomImage';

const PpobListrik = ({ navigation }) => {
	return <Container>
		<GlobalHeader title="Listrik" onPressBack={() => navigation.goBack()} />
		<ContainerBody>
			{["token", "prabayar", "ntl"].map((item, i) => (
				<Button
					key={i}
					onPress={() => navigation.navigate(`/ppob/listrik/${item}`)}
					style={{ marginBottom: 5 }}
					padding={$Padding(5, 10)}
					wrapper={{ justify: 'flex-start' }}
					color={['whiteColor', 'greyFont']}>
					<Image width="13%" size={30} source={require('src/assets/icons/phone.png')} />
					<Wrapper width="87%" justify="space-between">
						<Text>{item}</Text>
						<Image size={20} source={require('src/assets/icons/next.png')} />
					</Wrapper>
				</Button>))}
		</ContainerBody>
	</Container>
}
export default PpobListrik