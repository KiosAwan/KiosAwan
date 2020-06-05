import React, { useState, useEffect } from 'react'
import { View, ScrollView, FlatList, StyleSheet, TouchableOpacity, Clipboard } from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { convertRupiah } from 'src/utils/authhelper';
import { FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import Accordion from 'src/components/View/Accordion';
import { Bottom } from 'src/components/View/Bottom';
import { useSelector } from 'react-redux';
import { requestTopUp } from 'src/utils/api/ppobapi';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getPaymentChannelList } from 'src/utils/api/topup_api';
import Divider from 'src/components/Row/Divider';
import { $BorderRadius, $Padding } from 'src/utils/stylehelper';
import { Toast } from 'native-base';
import { CopyButton } from 'src/components/Button/CopyButton';
import Alert from 'src/utils/alert';
import { DEV_IMG_URL } from 'src/config';
import Icon from 'react-native-vector-icons/FontAwesome5'
import Container, { Body } from 'src/components/View/Container';
import { SizeList } from 'src/styles/size';
const Topup = ({ navigation }) => {
	const [listPaymentMethod, setListPaymentMethod] = useState([])
	const [apiLoading, setApiLoading] = useState(false)
	const [toggled, setToggled] = useState({})
	//alert
	const [alert, setAlert] = useState(false)
	const [alertMessage, setAlertMessage] = useState(false)

	const User = useSelector(state => state.User)

	useEffect(() => {
		_getPaymentData()
	}, [])

	// Get payment channel List data
	const _getPaymentData = async () => {
		const res = await getPaymentChannelList()
		if (res.status == 200) {
			setListPaymentMethod(res.data)
		} else {
			Alert(JSON.stringify(res))
		}

	}
	return (
		<Container header={{
			title: "Top Up",
			onPressBack: () => navigation.goBack()
		}}>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={apiLoading} />
			<Body>
				<Text>Saldo Anda saat ini :
						<Text color="primary" font="SemiBold">{convertRupiah(User.data.saldo)}</Text>
				</Text>
				<Text style={{ marginVertical: SizeList.base }}>Pilih bank</Text>
				{
					listPaymentMethod.rMap((item, key) => (
						<View key={key} style={styles.group}>
							<View style={{ flexDirection: "row", alignItems: "center", borderRadius: 5 }}>
								<Image style={{ width: "15%", height: 25, marginHorizontal: 5 }} source={{ uri: `${DEV_IMG_URL}/${item.logo}` }} />
								<View style={{ width: "80%", alignSelf: "flex-end" }}>
									<Text>{item.title}</Text>
									<Text size={12}>{`Admin : ${convertRupiah(item.adminFee)}`}</Text>
									<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
										<Text font="SemiBold">{item.noVa}</Text>
										<CopyButton onPress={() => {
											Toast.show({ text: "Berhasil disalin", type: "success" })
											Clipboard.setString(item.noVa)
										}} />
									</View>
								</View>
							</View>
							{item.tutorials.rMap((ttr, i) => (
								<View key={i} style={{ borderWidth: 1, borderRadius: 5, margin: 10, borderColor: ColorsList.greyAuthHard, backgroundColor: 'white', }}>
									<TouchableOpacity activeOpacity={.9} onPress={() => { setToggled({ ...toggled, [`${(key + 1) * (key + 1) + i}`]: !toggled[(key + 1) * (key + 1) + i] }); console.debug(toggled[i * key + 1]); }}>
										<Wrapper justify="space-between" style={[styles.content, toggled[(key + 1) * (key + 1) + i] ? { borderBottomWidth: 1, borderBottomColor: ColorsList.greyAuthHard } : null]}>
											<Text font="SemiBold">{ttr.title}</Text>
											<Text color="primary" size={18}>{toggled[(key + 1) * (key + 1) + i] ? "-" : "+"}</Text>
										</Wrapper>
									</TouchableOpacity>
									{toggled[(key + 1) * (key + 1) + i] ?
										<View style={[styles.content, $BorderRadius(0, 0, 5, 5)]}>
											{ttr.steps.rMap((step, ia) => (
												<View key={ia} style={styles.categoryView}>
													<View style={styles.categoryCircle}>
														<Text size={10} color="whiteColor">0{(ia + 1)}</Text>
													</View>
													<View style={{ width: '80%' }}>
														<Text>{step}</Text>
													</View>
												</View>
											))}
										</View>
										: null}
								</View>
							))}
						</View>
					))}
			</Body>
		</Container>
	)
}

export default Topup;

const styles = StyleSheet.create({
	group: { elevation: 2, backgroundColor: ColorsList.whiteColor, padding: 10, borderRadius: 5, marginBottom: 10 },
	container: {
		flex: 1,
		backgroundColor: ColorsList.authBackground,
	},
	childContainer: {
		flex: 1,
		margin: 20,
		marginBottom: 50
	},
	infoPembayaran: {
		backgroundColor: 'white',
		borderRadius: 5
	},
	detailTagihan: {
		borderTopColor: ColorsList.greyAuthHard,
		borderTopWidth: 1,
	},
	wrapperDetail: {
		borderBottomColor: ColorsList.greyAuthHard,
		borderBottomWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 4
	},
	content: {
		padding: 5,
		...$BorderRadius(5),
		backgroundColor: 'white'
	},
	contentToggled: {
		backgroundColor: ColorsList.primary,
		...$BorderRadius(5, 5, 0, 0)
	},
	categoryView: {
		marginVertical: 5,
		flexDirection: 'row',
		alignSelf: "flex-start",
		justifyContent: "center",
		alignItems: "flex-start"
	},
	categoryCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: ColorsList.primary,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5
	},
})