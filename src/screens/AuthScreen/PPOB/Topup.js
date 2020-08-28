import React, { useState, useEffect } from "react"
import {
	View,
	ScrollView,
	FlatList,
	StyleSheet,
	TouchableOpacity,
	Clipboard,
} from "react-native"
import { GlobalHeader } from "src/components/Header/Header"
import { ColorsList } from "src/styles/colors"
import { convertRupiah } from "src/utils/authhelper"
import { FloatingInputLabelCurrency } from "src/components/Input/InputComp"
import { Button } from "src/components/Button/Button"
import { Wrapper } from "src/components/View/Wrapper"
import { Text } from "src/components/Text/CustomText"
import { Image } from "src/components/CustomImage"
import { Bottom } from "src/components/View/Bottom"
import { useSelector } from "react-redux"
import { requestTopUp } from "src/utils/api/ppobapi"
import { AwanPopup } from "src/components/ModalContent/Popups"
import { getPaymentChannelList } from "src/utils/api/topup_api"
import Divider from "src/components/Row/Divider"
import { $BorderRadius, $Padding } from "src/utils/stylehelper"
import { Toast } from "native-base"
import { CopyButton } from "src/components/Button/CopyButton"
import Alert from "src/utils/alert"
import { DEV_IMG_URL } from "src/config"
import Icon from "react-native-vector-icons/FontAwesome5"
import Container, { Body } from "src/components/View/Container"
import { SizeList } from "src/styles/size"
const Topup = ({ navigation }) => {
	const [listPaymentMethod, setListPaymentMethod] = useState([])
	const [apiLoading, setApiLoading] = useState(false)
	const [toggled, setToggled] = useState({})
	//alert
	const [alert, setAlert] = useState(false)
	const [Step, setStep] = useState(false)
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
	const renderBank = () => {
		return (
			<View>
				<FlatList
					style={{ flex: 1 }}
					numColumns={2}
					data={
						listPaymentMethod.length % 2 == 0
							? listPaymentMethod
							: [...listPaymentMethod, ""]
					}
					keyExtractor={(a, i) => i.toString()}
					renderItem={({ item, index }) => {
						return (
							<Button
								onPress={() => {
									if (item.enabled == 1) {
										setStep(item)
									}
								}}
								color={item.enabled == 0 ? "grey" : "topupActive"}
								style={{
									flex: 1,
									margin: SizeList.secondary,
									borderRadius: SizeList.borderRadius,
								}}>
								{item != "" && (
									<Image
										style={{ width: "80%", height: 50, marginHorizontal: 5 }}
										source={{ uri: `${item.logo}` }}
									/>
								)}
							</Button>
						)
					}}
				/>
				<Text>
					Jika anda mengalami kesulitan dalam melakukan TOPUP dapat menghubungi
					<Text
						color="primary"
						onPress={() => navigation.navigate("/drawer/help")}>
						{" "}
						HELPDESK
					</Text>{" "}
					kami.
				</Text>
			</View>
		)
	}
	const renderStep = () => {
		const { selectedId, logo, title, tutorials, noVa, adminFee, info } = Step
		return (
			<View>
				<View
					style={{
						backgroundColor: ColorsList.white,
						padding: SizeList.base,
						borderRadius: SizeList.secondary,
					}}>
					<Wrapper flexStart>
						<Image
							style={{ width: 50, height: 50 }}
							source={{ uri: `${logo}` }}
						/>
						<View style={{ marginLeft: SizeList.base }}>
							<Text>{title}</Text>
							<Text>Biaya admin: {adminFee.convertRupiah()},-</Text>
						</View>
					</Wrapper>
					<Wrapper spaceBetween>
						<Text
							_width="80%"
							size={16}
							font="SemiBold"
							style={{ letterSpacing: 2.5 }}>
							{noVa}
						</Text>
						<CopyButton
							_width="20%"
							style={{ alignSelf: "flex-end" }}
							onPress={() => {
								Toast.show({ text: "Berhasil disalin", type: "success" })
								Clipboard.setString(noVa)
							}}
						/>
					</Wrapper>
					<Divider style={{ marginVertical: SizeList.base }} />
					{tutorials.rMap((item, i) => {
						const { id, title, steps } = item
						return (
							<View>
								<Button
									spaceBetween
									padding={0}
									onPress={() =>
										setStep({ ...Step, selectedId: id == selectedId ? "" : id })
									}
									color="link">
									<Text color="greyFontHard">{title}</Text>
									<Text color="primary">{id == selectedId ? "-" : "+"}</Text>
								</Button>
								{id == selectedId &&
									steps.rMap((step, i) => (
										<Text>
											{i + 1}. {step}
										</Text>
									))}
							</View>
						)
					})}
				</View>
				<Text style={{ marginVertical: SizeList.base }}>
					Minimal topup Rp. 50.000 dengan kelipatan Rp. 1.000
				</Text>
				{info && (
					<Button
						disabled
						color="info"
						flexStart
						style={{ borderRadius: SizeList.borderRadius, marginBottom: 10 }}>
						<Text color="informationFont">{`${info}`}</Text>
					</Button>
				)}
			</View>
		)
	}
	return (
		<Container
			header={{
				title: "Top Up Saldo",
				onPressBack: () => {
					if (Step) {
						setStep(false)
					} else {
						navigation.goBack()
					}
				},
			}}>
			<AwanPopup.Alert
				message={alertMessage}
				visible={alert}
				closeAlert={() => setAlert(false)}
			/>
			<AwanPopup.Loading visible={apiLoading} />
			<Body>
				<Text>
					Saldo Anda saat ini :
					<Text color="primary" font="SemiBold">
						{" "}
						{convertRupiah(User.data.saldo)}
					</Text>
				</Text>
				<Text style={{ marginVertical: SizeList.base }}>
					{Step ? `Cara Topup ${Step.title}` : "Pilih bank"}
				</Text>
				{Step ? renderStep() : renderBank()}
			</Body>
		</Container>
	)
}

export default Topup

const styles = StyleSheet.create({
	group: {
		elevation: 2,
		backgroundColor: ColorsList.whiteColor,
		padding: 10,
		borderRadius: 5,
		marginBottom: 10,
	},
	container: {
		flex: 1,
		backgroundColor: ColorsList.authBackground,
	},
	childContainer: {
		flex: 1,
		margin: 20,
		marginBottom: 50,
	},
	infoPembayaran: {
		backgroundColor: "white",
		borderRadius: 5,
	},
	detailTagihan: {
		borderTopColor: ColorsList.greyAuthHard,
		borderTopWidth: 1,
	},
	wrapperDetail: {
		borderBottomColor: ColorsList.greyAuthHard,
		borderBottomWidth: 1,
		paddingHorizontal: 15,
		paddingVertical: 4,
	},
	content: {
		padding: 5,
		...$BorderRadius(5),
		backgroundColor: "white",
	},
	contentToggled: {
		backgroundColor: ColorsList.primary,
		...$BorderRadius(5, 5, 0, 0),
	},
	categoryView: {
		marginVertical: 5,
		flexDirection: "row",
		alignSelf: "flex-start",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	categoryCircle: {
		width: 20,
		height: 20,
		borderRadius: 10,
		backgroundColor: ColorsList.primary,
		justifyContent: "center",
		alignItems: "center",
		marginHorizontal: 5,
	},
})
