import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View } from 'react-native';
import { useSelector } from 'react-redux'
import { Text } from 'src/components/Text/CustomText'
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Padding } from 'src/utils/stylehelper';
import Container, { Body } from 'src/components/View/Container';

const Akun = ({ navigation }) => {
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
	const AkunButton = (props) => {
		return <Button
			onPress={() => {
				if (props.name == "Keluar") {
					_onPressLogout()
				} else {
					["Helpdesk", "FAQ"].includes(props.name) ? navigation.navigate(props.route) : User.store && User.data.status == 1 ? navigation.navigate(props.route) : null
				}
			}}
			style={{ borderRadius: 5, marginBottom: !props.noBottom ? 3 : 15 }}
			padding={$Padding(5, 10)}
			wrapper={{ justify: 'flex-start' }}
			color={['whiteColor', 'greyFont']}>
			<Wrapper width="100%" justify="space-between">
				<Text>{props.name}</Text>
			</Wrapper>
		</Button>
	}
	return (
		<Container>
			<Text style={{ marginTop : 15 }} font="SemiBold" align="center">AKUN</Text>
			<Body>
				<Wrapper style={{ marginBottom: 10 }} justify="space-between">
					<View>
						<Text font="SemiBold" >{User.data.name}</Text>
						<Text size={12}>{User.data.reff_code}</Text>
					</View>
					<Button disabled width={110} padding={5}>FREE USER</Button>
				</Wrapper>
				<AkunButton
					name="Data pribadi"
					route="/drawer/settings/profile"
					noBottom
				/>
				<AkunButton
					name="Ubah email"
					route="/drawer/settings/change-email"
				/>
				<AkunButton
					name="Ubah No. Hp"
					route="/drawer/settings/change-phone-number"
				/>
				<AkunButton
					name="Ubah password"
					route="/drawer/settings/change-password"
				/>
				<AkunButton
					name="Ubah PIN"
					route="/drawer/settings/change-pin"
				/>
				<AkunButton
					name="Lupa PIN"
					route="/drawer/settings/lupa-pin"
					noBottom
				/>
				<AkunButton
					name="Pengaturan perangkat"
					route=""
					noBottom
				/>
				<AkunButton
					name="FAQs"
					route="/drawer/faq"
				/>
				<AkunButton
					name="Helpdesk"
					route="/drawer/help"
				/>
				<AkunButton
					name="Rate Awan"
					route=""
					noBottom
				/>
				<AkunButton
					name="Keluar"
					route=""
				/>
			</Body>
		</Container>
	)
}

export default Akun