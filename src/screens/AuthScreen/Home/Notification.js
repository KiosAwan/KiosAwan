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

const Notification = ({ User, maintenance, message, navigation, modal }) => {
	const [setAlertMessage, setAlert, setModalVisible, setAlertTitle] = modal
	return <View>
		{
			maintenance && <Button disabled color="info" flexStart style={{ borderRadius: SizeList.borderRadius }}>
				<Icon color={ColorsList.info} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
				<TextTicker
					width="90%"
					style={{ color: ColorsList.info, fontFamily: FontList.regularFont }}
					duration={20000}
					loop
					bounce
					marqueeDelay={500}
				>{message}</TextTicker>
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
				<Button onPress={() => CreatePin({ User, navigation, setAlertMessage, setAlert, setModalVisible, setAlertTitle })} flexStart color="warning" flexStart style={{ borderRadius: SizeList.borderRadius, marginBottom: SizeList.base }}>
					<Icon color={ColorsList.white} name="exclamation-circle" style={{ marginHorizontal: 10 }} />
					<Text color="white">Lengkapi Profil Anda Sekarang! </Text>
					<Text color="white" style={{ textDecorationLine: 'underline' }}>Klik disini</Text>
				</Button>
		}
	</View>
}

export default Notification