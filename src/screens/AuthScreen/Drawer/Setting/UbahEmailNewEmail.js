import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
	View,
	StyleSheet,
	Dimensions,
	TextInput,
	Modal
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import AsyncStorage from '@react-native-community/async-storage';
import { changeEmail, getUserToken } from 'src/utils/authhelper';
import { getProfile } from 'src/redux/actions/actionsUserData';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import MDInput from 'src/components/Input/MDInput';


const height = Dimensions.get('window').height

const UbahEmailNewEmail = ({ navigation }) => {
	const dispatch = useDispatch()
	const [newEmail, setNewEmail] = useState()
	const User = useSelector(state => state.User)
	const [modalVisible, setModalVisible] = useState(false)

	const _handleNextBtn = async () => {
		setLoading(true)
		const id = await AsyncStorage.getItem('userId')
		const data = {
			id,
			email: newEmail
		}
		const res = await changeEmail(data)
		setLoading(false)
		if (res.status == 200) {
			const userToken = await getUserToken()
			setModalVisible(true)
			setTimeout(() => {
				setModalVisible(false)
				dispatch(getProfile(User.data.id, userToken))
				navigation.navigate('/drawer/settings')
			}, 1000)
		} else if (res.status == 400) {
			alert(res.data.errors.msg)
		}
	}

	const [loading, setLoading] = useState(false)
	return (
		<View style={styles.container} >
			<BarStatus />
			<GlobalHeader
				onPressBack={() => navigation.goBack()}
				title="Ubah Email"
			/>
			<Modal
				animationType="fade"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<ModalContent
					image={require('src/assets/images/successchangeemail.png')}
					infoText="Anda Berhasil Mengubah Email!"
					closeModal={() => setModalVisible(false)}
				/>
			</Modal>
			<AwanPopup.Loading visible={loading} />
			<View style={{ alignItems: "center", marginTop: 20 }}>
				<View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
					<MDInput label="Email lama" value={User.data.email}
						editable={false}
					/>
				</View>
				<View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
					<MDInput label="Email baru" value={newEmail}
						onChangeText={(text) => setNewEmail(text)}
					/>
				</View>
			</View>
			<View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
				<BottomButton
					onPressBtn={_handleNextBtn}
					style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
					buttonTitle="SIMPAN"
				/>
			</View>
		</View>
	);
}

export default UbahEmailNewEmail

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: ColorsList.authBackground
	},
	borderStyleBase: {
		width: 30,
		height: 45,
		borderRadius: 20
	},

	borderStyleHighLighted: {
		borderColor: ColorsList.successHighlight,
	},

	underlineStyleBase: {
		width: 30,
		height: 45,
		borderWidth: 0,
		borderBottomWidth: 1,
	},

	underlineStyleHighLighted: {
		borderColor: ColorsList.successHighlight,
	},
})