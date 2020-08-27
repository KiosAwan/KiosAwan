import TextTicker from 'react-native-text-ticker';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, Modal } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';
import { FontList } from 'src/styles/typography';
import { ColorsList } from "src/styles/colors"
import { Button } from "src/components/Button/Button"
import CreatePin from './CreatePin';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const Notification = ({ User, maintenance, message = "", navigation, modal, dispatch }) => {
	const [setAlertMessage, setAlert, setModalVisible, setAlertTitle] = modal
	return <View>
		{
			maintenance && <Button disabled color="info" flexStart style={{ borderRadius: SizeList.borderRadius, marginBottom: 10 }}>
				<Icon color={ColorsList.informationFont} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
				<TextTicker
					loop
					bounce
					width="90%"
					style={{ color: ColorsList.informationFont, fontFamily: FontList.regularFont }}
					duration={20000}
					marqueeDelay={500}
					children={message}
				/>
			</Button>
		}
		{
			User.store ?
				User.data.status == 0 &&
				<Button onPress={() => navigation.navigate('/drawer/settings/change-email')} color="purple" flexStart style={{ borderRadius: SizeList.borderRadius, marginBottom: SizeList.base }}>
					<Icon color={ColorsList.purple} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
					<Text color="purple">Verifikasi Email Anda Sekarang!</Text>
				</Button>
				:
				<Button onPress={() => {
					if (User.data.atur_pin == 1) {
						navigation.navigate("/temp/update-profile")
					} else {
						CreatePin({ User, navigation, setAlertMessage, setAlert, setModalVisible, setAlertTitle, dispatch })
					}
				}} flexStart color="warning" flexStart style={{ borderRadius: SizeList.borderRadius, marginBottom: SizeList.base }}>
					<Icon color={ColorsList.white} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
					<Text color="white">Lengkapi Profil Anda Sekarang! </Text>
					<Text color="white" style={{ textDecorationLine: 'underline' }}>Klik disini</Text>
				</Button>
		}
	</View>
}

export default Notification