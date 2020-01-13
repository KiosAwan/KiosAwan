import React, { Component } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { $Padding, $BorderRadius, $Margin, $Border } from 'src/utils/stylehelper';
import { Icon } from 'native-base';
import { Wrapper } from 'src/components/View/Wrapper';
import { useSelector } from 'react-redux';
const Help = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const _openUrl = url => Linking.openURL(url)
	return (
		<View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
			<GlobalHeader style={{ height: 190 }} title="Hubungi Kami" onPressBack={() => navigation.goBack()} />
			<View style={{ ...$Padding(0, 15), alignItems: 'center' }}>
				<View style={{ ...$Margin(0, 0, 15) }}>
					<Text color="whiteColor" align="center" size={25}>Halo {User.data.name}!</Text>
					<Text color="whiteColor" align="center">{'Silahkan hubungi tim KiosAwan\njika anda memiliki pertanyaan atau saran'}</Text>
				</View>
				<View style={styles.white}>
					<Text align="center">Hubungi nomor ini untuk pelayanan lebih lanjut</Text>
					<TouchableOpacity onPress={() => _openUrl('tel:622129488776')}>
						<Wrapper justify="center">
							<Text color="primary" font="ExtraBold" size={30}>021-294-88-776</Text>
							<Icon style={{ color: ColorsList.primary, fontSize: 30, marginLeft: 10 }} name="call" />
						</Wrapper>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={[styles.white, { marginTop: 10 }]} onPress={() => _openUrl('https://wa.me/6285717570370')}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="logo-whatsapp" />
						<Text size={15}>Live Chat via WhatsApp</Text>
					</Wrapper>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.white, { marginTop: 10 }]} onPress={() => _openUrl('mailto:info@kiosawan.com')}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="mail" />
						<Text size={15}>Kirim Email ke Helpdesk KiosAwan</Text>
					</Wrapper>
				</TouchableOpacity>
				<View style={styles.infoTag}>
					<Text align="center" style={styles.infoTagTitle}>Hubungi kami kapanpun</Text>
					<Text align="center" size={12}>{`Puri Imperium Office Plaza Unit G5\nJalan Kuningan Madya Kav 5-6, Jakarta Selatan\n12980 Tlp. 021 294 88 777 | Fax. 021 294 88 770\nEmail: info@kiosawan.com`}</Text>
				</View>
			</View>
		</View>
	)
}
export default Help

const styles = StyleSheet.create({
	white: { backgroundColor: ColorsList.whiteColor, ...$BorderRadius(5), padding: 15, width: '100%' },
	infoTag: { ...$BorderRadius(5), ...$Border(ColorsList.greyAuthHard, 1), padding: 15, paddingTop: 15, position: 'relative', width: '100%', marginTop: 15 },
	infoTagTitle: { backgroundColor: ColorsList.authBackground, position: 'absolute', left: '30%', right: '30%', top: -10 }
})