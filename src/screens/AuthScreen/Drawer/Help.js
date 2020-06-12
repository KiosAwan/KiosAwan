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
import { convertPhoneNumber, getUserToken } from 'src/utils/authhelper';
import Container, { Body } from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';
import Divider from 'src/components/Row/Divider';
import { Button } from 'src/components/Button/Button';
const Help = ({ navigation }) => {
	const User = useSelector(state => state.User)
	const [callCenter, setCallCenter] = useState()
	const [whatsapp, setWhatsapp] = useState()
	const [mail, setMail] = useState('info@kiosawan.com')
	useEffect(() => {
		_getData()
	}, [])
	const _getData = async () => {
		const userToken = await getUserToken()
		const res = await Axios.get(`${HOST_URL}/pusatbantuan`, {
			headers: { "authorization": userToken }
		})
		setCallCenter(res.data.data[0].no_telpon)
		setWhatsapp(res.data.data[0].no_whatsapp)
		setMail(res.data.data[0].email)
	}
	const _openUrl = url => Linking.openURL(url)
	return (
		<Container>
			<GlobalHeader title="HELPDESK" onPressBack={() => navigation.goBack()} />
			<Body>
				<View>
					<Text align="left">Halo,</Text>
					<Text align="left" font="SemiBold" size={16}>{User.data.name.toUpperCase()}</Text>
				</View>
				<Divider style={{ marginVertical: SizeList.base }} />
				<View style={styles.secondView}>
					<Text>Hubungi nomor ini untuk pelayanan lebih lanjut</Text>
					<TouchableOpacity onPress={() => _openUrl(`tel:${callCenter}`)}>
						<Wrapper justify="flex-start">
							<Text color="primary" font="SemiBold" size={30}>{convertPhoneNumber(callCenter)}</Text>
							<Button disabled style={{ width: 40, justifyContent: "center", marginLeft: 20 }}>
								<Icon style={{ color: ColorsList.white, fontSize: 20 }} name="call" />
							</Button>
						</Wrapper>
					</TouchableOpacity>
				</View>
				<TouchableOpacity style={[styles.card, { marginTop: 10 }]} onPress={() => _openUrl(`https://wa.me/${whatsapp}`)}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="logo-whatsapp" />
						<Text size={15}>Live Chat via WhatsApp</Text>
					</Wrapper>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.card, { marginTop: 10 }]} onPress={() => _openUrl(`mailto:${mail}`)}>
					<Wrapper justify="flex-start">
						<Icon style={{ color: ColorsList.primary, fontSize: 15, marginRight: 10 }} name="mail" />
						<Text size={15}>Kirim Email ke Helpdesk KiosAwan</Text>
					</Wrapper>
				</TouchableOpacity>
				<View style={styles.infoTag}>
					<Text font="SemiBold" style={styles.infoTagTitle}>Alamat</Text>
					<Text>{`Puri Imperium Office Plaza Unit G5\nJalan Kuningan Madya Kav 5-6, Jakarta Selatan\n12980 Tlp. 021 294 88 777 | Fax. 021 294 88 770\nEmail: info@kiosawan.com`}</Text>
				</View>
			</Body>
		</Container>
	)
}
export default Help

const styles = StyleSheet.create({
	card: {
		backgroundColor: ColorsList.white,
		borderWidth: SizeList.borderWidth,
		borderRadius: SizeList.borderRadius,
		borderColor: ColorsList.borderColor,
		padding: SizeList.padding
	},
	infoTag: { marginTop: SizeList.base },
})