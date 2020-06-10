import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';
import { ColorsList } from '../../styles/colors';
import FastImage from 'react-native-fast-image'
import { Wrapper } from '../View/Wrapper';
import { SizeList } from 'src/styles/size';
import { Text } from '../Text/CustomText';


const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export const CardComp = (props) => {
	return (
		<View style={styles.wrapView}>
			<TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={props.onPressCard} disabled={props.disabled}>
				<View style={[styles.card, props.cardStyle]}>
					<Image style={{ width: 50, height: 50, marginHorizontal: 10 }} source={props.icon} />
					<View style={{ width: '70%', paddingLeft: 20 }}>
						<Text style={styles.infoText}>{props.info}</Text>
						<Text style={styles.subText}>{props.subInfo}</Text>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
}

export const TransactionCard = (props) => {
	return (
		<View style={{ ...RowChild, justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2 }}>
			<Icon name="money-bill-alt" />
			<View>
				<Text>Rp. {props.total_transaction}</Text>
				<Text>{props.payment_code}</Text>
				{props.status_payment == 3 ? <Text>Dibatalkan</Text> : null}
			</View>
			<View>
				<Text>{props.payment_type}</Text>
				<Text>{props.transactiontime}</Text>
			</View>
		</View>
	)
}

export const LinearCardComp = (props) => {
	return (
		<View style={{ height: height / 15, backgroundColor: 'white', justifyContent: "center", borderRadius: 5 }}>
			<View style={{ ...RowChild, justifyContent: "space-between" }}>
				<View style={{ flexDirection: 'row', alignItems: "center", marginLeft: 20 }}>
					<Icon size={20} name="wallet" color={ColorsList.primaryColor} />
					<Text style={{ fontSize: 13, color: 'grey', fontFamily: FontList.primaryFont, paddingLeft: 10, paddingRight: 50 }}>Saldo : Rp. 470.000</Text>
				</View>
				<TouchableOpacity>
					<View style={styles.topUpStyle}>
						<Text style={{ color: 'white', fontFamily: 'Nunito-Bold' }}>TOP UP</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>

	);
}


export const CardTextImage = (props) => {
	return (
		<TouchableOpacity onPress={props.onPressCard}>
			<View style={[styles.CardTextImage, props.style]}>
				<Image style={styles.imageCardTextImage} source={{ uri: props.image }} />
				<View style={styles.textImageWrapper}>
					<Text style={{ fontSize: FontList.titleSize, color: ColorsList.greyFont, paddingHorizontal: '6%' }}>{props.info}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

export const ImageText = props => {
	return <View style={[styles.viewNoImageProduct, { width: props.size || width * 0.17, height: props.size || width * 0.17 }, props.style]}>
		<Text font="SemiBold" color="greyFont" size={20}>{props.name ? props.notGenerated ? props.name : props.name.generateInitial() : null}</Text>
	</View>
}

export const ProductCard = props => {
	return <TouchableOpacity onPress={props.onPressPlus ? props.plusDisabled ? null : props.onPressPlus : null} activeOpacity={props.onPressPlus ? .5 : 1}>
		<Wrapper style={{ backgroundColor: 'white', marginBottom: SizeList.base, borderRadius: 5, padding: SizeList.base }} spaceBetween>
			{
				props.manage_stock ?
					props.productImage ?
						<FastImage style={{ width: width * 0.17, height: width * 0.17, backgroundColor: ColorsList.greyAuthHard }} source={{ uri: props.productImage }} />
						:
						<ImageText name={props.name} />
					:
					props.productImage ?
						<FastImage
							style={{ width: width * 0.17, height: width * 0.17, backgroundColor: ColorsList.greyAuthHard }}
							source={{ uri: props.productImage, priority: FastImage.priority.high, }}

						/>
						:
						<ImageText name={props.name} />
			}
			<View style={{ marginHorizontal: SizeList.base }} _flex>
				<Text font="SemiBold" color="primary">{props.name.length > 25 ? props.name.substr(0, 25) + '...' : props.name}</Text>
				<Text style={[props.min_stock ? parseInt(props.stock) <= parseInt(props.min_stock) ? { color: ColorsList.danger } : (props.stock - props.quantity) <= props.min_stock ? { color: ColorsList.danger } : null : null]}>{props.stock ? `Stok : ${props.stock}` : "Fitur stok tidak aktif"}</Text>
				<Text>{props.price}</Text>
			</View>
			{
				props.right ? props.right : <View style={{ backgroundColor: ColorsList.modalBackground, borderRadius: SizeList.secondary }}>
					<TouchableOpacity onPress={props.onPressPlus} disabled={props.plusDisabled} style={styles.cardPlusMinusIcon}>
						<Image style={{ width: 12, height: 12 }} source={require("src/assets/icons/plus.png")} />
					</TouchableOpacity>
					<Text font="SemiBold" style={{ marginHorizontal: 8 }}>{props.quantity ? props.quantity : 0}</Text>
					<TouchableOpacity onPress={props.onPressMinus} style={styles.cardPlusMinusIcon}>
						<Image style={{ width: 12, height: 12 }} source={require("src/assets/icons/minus.png")} />
					</TouchableOpacity>
				</View>
			}
		</Wrapper>
	</TouchableOpacity>
}

export const ReturnTransactionCard = (props) => {
	return (
		<View style={{ height: height / 7, backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
			<View style={[styles.card, props.cardStyle]}>
				<View style={{ ...RowChild, height: '100%', width: '90%' }}>
					{/* <View></View> */}
					<View style={{ width: '50%', paddingLeft: 10 }}>
						<Text style={styles.infoText}>{props.name}</Text>
						<Text style={[styles.infoText, { color: ColorsList.greyFont }]}>{props.price}</Text>
					</View>
				</View>
				{
					props.right ? props.right :
						<View style={{ width: '10%', backgroundColor: '#f9faf7', height: '100%', justifyContent: "space-around", alignItems: "center", borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
							<TouchableOpacity onPress={props.onPressPlus} disabled={props.plusDisabled} style={styles.cardPlusMinusIcon}>
								<Icon size={20} name="plus" color={ColorsList.greyFont} />
							</TouchableOpacity>
							<Text style={{ marginHorizontal: 8, color: ColorsList.primaryColor }}>{props.quantity ? props.quantity : 0}</Text>
							<TouchableOpacity onPress={props.onPressMinus} disabled={props.minusDisabled} style={styles.cardPlusMinusIcon}>
								<Icon size={20} name="minus" color={ColorsList.greyFont} />
							</TouchableOpacity>
						</View>
				}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		height: '100%',
		...RowChild,
		// justifyContent : 'space-between',
	},
	infoText: {
		color: '#cd0192',
		...FontList.titleFont
	},
	wrapView: {
		height: height / 7,
		backgroundColor: 'transparent',
		paddingBottom: 10
	},
	walletInfo: {
		color: 'white',
		fontSize: 12,
		textAlign: 'center',
		fontFamily: 'Nunito-Regular'
	},
	subText: {
		color: 'grey',
		...FontList.subtitleFont
	},
	CardTextImage: {
		width: width / 1.3,
		height: height / 3,
		alignItems: "center",
	},
	imageCardTextImage: {
		width: '100%',
		height: '60%',
		borderTopRightRadius: 5,
		borderTopLeftRadius: 5,
		resizeMode: 'stretch'
	},
	textImageWrapper: {
		backgroundColor: 'white',
		height: '30%',
		justifyContent: "center",
		borderBottomEndRadius: 5,
		borderBottomStartRadius: 5
	},
	topUpStyle: {
		width: width / 5,
		height: 25,
		marginRight: 10,
		backgroundColor: ColorsList.primaryColor,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5
	},
	cardPlusMinusIcon: {
		alignItems: "center",
		justifyContent: "center",
		width: '100%',
		padding: 5
	},
	viewNoImageProduct: {
		backgroundColor: "#e5e5e5",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5
	}
})
