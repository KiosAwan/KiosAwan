import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { Button } from 'src/components/Button/Button';
import { ColorsList } from 'src/styles/colors';
import NetInfo from '@react-native-community/netinfo';
import { Image } from 'src/components/CustomImage';
import Container, { Footer } from 'src/components/View/Container';
import { Wrapper } from 'src/components/View/Wrapper';

const NotConnected = ({ navigation }) => {
	const [loading, setLoading] = useState(false)
	const navigate = (path, params) => {
		NetInfo.fetch().then(state => {
			setTimeout(() => {
				setLoading(false)
				if (state.isInternetReachable) {
					navigation.navigate(path, params)
				}
			}, 500)
		});
	}
	const goBack = () => {
		setLoading(true)
		try {
			let { routeName, params } = nextScene.route
			routeName = Boolean(routeName) ? routeName : {}
			navigate(routeName, params)
		} catch (err) {
			navigate('/splashscreen')
		}
	}
	return <Container padding>
		<Wrapper direction="column" center style={{ flex: 1 }}>
			<Image align="center" size={200} source={require('src/assets/images/not-connected.png')} />
			<Text align="center" size={20} font="ExtraBold">Internet tidak tersedia</Text>
			<Text align="center" style={{ marginBottom: 15 }}>Mohon hubungkan ke jaringan internet untuk memulai kembali</Text>
		</Wrapper>
		<Footer noPadding>
			<Button width="100%" disabled={loading} wrapper={{ justify: 'center' }} onPress={goBack} >
				<Text color="whiteColor">Coba Lagi</Text>
				{loading ? <ActivityIndicator style={{ marginLeft: 5 }} color={ColorsList.whiteColor} /> : <View></View>}
			</Button>
		</Footer>
	</Container>
}
export default NotConnected