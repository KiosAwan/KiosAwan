import React, { Component, useEffect, useState } from 'react';
import { View, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { $Padding, $BorderRadius, $Margin, $Border } from 'src/utils/stylehelper';
import { Icon } from 'native-base';
import { Wrapper } from 'src/components/View/Wrapper';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { HOST_URL } from 'src/config';
import { convertPhoneNumber } from 'src/utils/authhelper';
const Help = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const [callCenter , setCallCenter] = useState()
	const [whatsapp , setWhatsapp] = useState()
	const [mail , setMail] = useState('info@kiosawan.com')
	useEffect(() => {
		_getData()
	}, [])
	const _getData = async() => {
		const res = await Axios.get(`${HOST_URL}/pusatbantuan`)
		setCallCenter(res.data.data[0].no_telpon)
		setWhatsapp(res.data.data[0].no_whatsapp)
		setMail(res.data.data[0].email)
	}
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
					<TouchableOpacity onPress={() => _openUrl(`tel:${callCenter}`)}>
						<Wrapper justify="center">
							<Text color="primary" font="ExtraBold" size={30}>{convertPhoneNumber(callCenter )}</Text>
							<Icon style={{ color: ColorsList.primary, fontSize: 30, marginLeft: 10 }} name="call" />
						</Wrapper>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={[styles.white, { marginTop: 10 }]} onPress={() => _openUrl(`https://wa.me/${whatsapp}`)}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="logo-whatsapp" />
						<Text size={15}>Live Chat via WhatsApp</Text>
					</Wrapper>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.white, { marginTop: 10 }]} onPress={() => _openUrl(`mailto:${mail}`)}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="mail" />
						<Text size={15}>Kirim Email ke Helpdesk KiosAwan</Text>
					</Wrapper>
				</TouchableOpacity>
				<View style={styles.infoTag}>
					<Text align="center" style={styles.infoTagTitle} size={13}>Hubungi kami kapanpun</Text>
					<Text align="center" size={10}>{`Puri Imperium Office Plaza Unit G5\nJalan Kuningan Madya Kav 5-6, Jakarta Selatan\n12980 Tlp. 021 294 88 777 | Fax. 021 294 88 770\nEmail: info@kiosawan.com`}</Text>
				</View>
			</View>
		</View>
	)
}
export default Help

const styles = StyleSheet.create({
	white: { backgroundColor: ColorsList.whiteColor, ...$BorderRadius(5), padding: 15, width: '100%' },
	infoTag: { ...$BorderRadius(5), ...$Border(ColorsList.greyAuthHard, 1), padding: 15, paddingTop: 15, position: 'relative', width: '100%', marginTop: 15 },
	infoTagTitle: { backgroundColor: ColorsList.authBackground, position: 'absolute', left: '20%', right: '20%', top: -10 }
})