import React, { Component } from 'react';
import { Text } from 'src/components/Text/CustomText';
import Container, { Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { $Padding } from 'src/utils/stylehelper';
import { Wrapper } from 'src/components/View/Wrapper';

const Manajemen = ({ navigation }) => {
	const ListManajemen = require('src/assets/json/manajemen.json')
	return (
		<Container>
			<Text style={{ marginTop: 15 }} font="Bold" align="center">MANAJEMEN</Text>
			<Body>
				<Text style={{ marginBottom: 10 }}>Pilih modul yang akan dikelola :</Text>
				{
					ListManajemen.rMap((menu, i) => {
						return <Button
							onPress={() => {
								navigation.navigate(menu.route)
							}}
							style={{ borderRadius: 5, marginBottom: 10 }}
							padding={$Padding(5, 10)}
							wrapper={{ justify: 'flex-start' }}
							color={['whiteColor', 'greyFont']}>
							<Wrapper width="100%" justify="space-between">
								<Text>{menu.name}</Text>
							</Wrapper>
						</Button>
					})
				}
			</Body>
		</Container>
	)
}

export default Manajemen
