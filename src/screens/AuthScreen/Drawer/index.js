import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux'
import { Text } from 'src/components/Text/CustomText'
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { $Padding } from 'src/utils/stylehelper';
import Container, { Body } from 'src/components/View/Container';
import { stylesglobe } from 'src/styles/globalStyle';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';

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
			width="100%"
			// padding={$Padding(5, 10)}
			wrapper={{ justify: 'flex-start' }}
			color={['whiteColor', 'greyFont']}>
			<Wrapper width="100%" justify="space-between">
				<Text>{props.name}</Text>
			</Wrapper>
		</Button>
	}
	return (
		<Container>
			<Text style={{ marginTop: 15 }} font="SemiBold" align="center">AKUN</Text>
			<Body>
				<Wrapper style={{ marginBottom: 10 }} justify="space-between">
					<View>
						<Text font="SemiBold" >{User.data.name.toUpperCase()}</Text>
						<Text size={12}>{User.data.reff_code}</Text>
					</View>
					<Button disabled width={110} padding={5}>FREE USER</Button>
				</Wrapper>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Data pribadi"
						route="/drawer/settings/profile"
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Ubah email"
						route="/drawer/settings/change-email"
					/>
					<Divider />
					<AkunButton
						name="Ubah No. Hp"
						route="/drawer/settings/change-phone-number"
					/>
					<Divider />
					<AkunButton
						name="Ubah password"
						route="/drawer/settings/change-password"
					/>
					<Divider />
					<AkunButton
						name="Ubah PIN"
						route="/drawer/settings/change-pin"
					/>
					<Divider />
					<AkunButton
						name="Lupa PIN"
						route="/drawer/settings/lupa-pin"
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Pengaturan perangkat"
						route=""
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="FAQs"
						route="/drawer/faq"
					/>
					<Divider />
					<AkunButton
						name="Helpdesk"
						route="/drawer/help"
					/>
					<Divider />
					<AkunButton
						name="Rate Awan"
						route=""
						noBottom
					/>
				</View>
				<View style={[stylesglobe.shadowView, styles.viewSeparator]}>
					<AkunButton
						name="Keluar"
						route=""
					/>
				</View>
			</Body>
		</Container>
	)
}

export default Akun

const styles = StyleSheet.create({
	viewSeparator: {
		marginBottom: SizeList.base,
		// paddingHorizontal : sizeli
	}
})