import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, ScrollView } from 'react-native';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { Icon, Grid, Col, Row } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ColorsList } from 'src/styles/colors';
import { Text } from 'src/components/Text/CustomText'
import { BottomButton } from 'src/components/Button/ButtonComp';
import { SizeList } from 'src/styles/size';
import { Image } from 'src/components/CustomImage';
import { Button } from 'src/components/Button/Button';
import { Bottom } from 'src/components/View/Bottom';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Padding } from 'src/utils/stylehelper';

const Akun = ({ navigation }) => {
	const ListMenu = require('src/assets/json/drawer.json')
	const User = useSelector(state => state.User)
	const _onPressLogout = async (props) => {
		try {
			await AsyncStorage.removeItem('userId')
			navigation.navigate('/unauth')
		}
		catch (e) {
			alert(e)
		};

	}
	const images = [
		require('src/assets/icons/setting1.png'),
		require('src/assets/icons/setting2.png'),
		require('src/assets/icons/setting3.png'),
		require('src/assets/icons/setting4.png'),
		require('src/assets/icons/setting5.png'),
		require('src/assets/icons/setting6.png')
	]
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground, }}>
			<GlobalHeader title="Setting" onPressBack={() => navigation.navigate('/')} />
			<ScrollView>
				<Wrapper justify="flex-start" style={{ backgroundColor: 'white', padding: 10 }}>
					<Image width="18%" size={50} source={require('src/assets/icons/profile.png')} />
					<Wrapper width="82%" justify="space-between">
						<View>
							<Text color="primary">{User.data.name}</Text>
							<Text>{User.store ? User.store.name_store : '~ Belum Ada Toko ~'}</Text>
							<Text>{User.data.reff_code}</Text>
						</View>
						<Button disabled color={['transparent', 'greyFont', 'greyFont']} padding={5}>Free User</Button>
					</Wrapper>
				</Wrapper>
				{
					ListMenu.map((groupMenu, i) => {
						return <View style={{ padding: 15 }} key={i}>
							{
								groupMenu.map((menu, o) => {
									return <Button key={o}
										onPress={() => ["Hubungi Kami", "FAQ"].includes(menu.name) ? navigation.navigate(menu.route) : User.store && User.data.status == 1 ? navigation.navigate(menu.route) : null}
										style={{ marginBottom: 5 }}
										padding={$Padding(5, 10)}
										wrapper={{ justify: 'flex-start' }}
										color={['whiteColor', 'greyFont']}>
										<Image width="13%" size={30} source={images[o]} />
										<Wrapper width="87%" justify="space-between">
											<Text>{menu.name}</Text>
											<Image size={20} source={require('src/assets/icons/next.png')} />
										</Wrapper>
									</Button>
								})
							}
						</View>
					})
				}
			</ScrollView>
			<Bottom>
				<View style={{ width: '100%' }}>
					{/* <Text style={{ alignSelf: 'center', marginBottom: 5 }}>Versi 1.0.0</Text> */}
					<Text style={{ alignSelf: 'center', marginBottom: 5 }}>Testing Versi 1.4.8.1</Text>
					<Button width="100%" style={{ marginBottom: 5 }}>UPGRADE KE PREMIUM</Button>
					<Button color="white" width="100%" onPress={_onPressLogout}>KELUAR</Button>
				</View>
			</Bottom>
		</View>
	)
}

export default Akun