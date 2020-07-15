import React from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet, Image, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography';
import { RowChild } from '../Helper/RowChild';
import { ColorsList } from '../../styles/colors';
import FastImage from 'react-native-fast-image'
import { Wrapper } from '../View/Wrapper';
import { SizeList } from 'src/styles/size';
import { Text } from '../Text/CustomText';
import PropTypes from 'prop-types'

const height = Dimensions.get('window').height
const width = Dimensions.get('window').width

export const CardTextImage = (props) => {
	return <TouchableOpacity onPress={props.onPressCard}>
		<View style={[styles.CardTextImage, props.style]}>
			<Image style={styles.imageCardTextImage} source={{ uri: props.image }} />
			<View style={styles.textImageWrapper}>
				<Text style={{ fontSize: FontList.titleSize, color: ColorsList.greyFont, paddingHorizontal: '6%' }}>{props.info}</Text>
			</View>
		</View>
	</TouchableOpacity>
}

export const ImageText = props => {
	return <View style={[styles.viewNoImageProduct, { width: props.size || width * 0.17, height: props.size || width * 0.17 }, props.style]}>
		<Text font="SemiBold" color="greyFont" size={20}>{props.name ? props.notGenerated ? props.name : props.name.generateInitial() : null}</Text>
	</View>
}

export const ProductCard = props => {
	const {
		manage_stock,
		min_stock,
		name,
		onPressMinus,
		onPressPlus,
		plusDisabled,
		price,
		productImage,
		quantity,
		right,
		stock
	} = props
	return <TouchableOpacity onPress={onPressPlus ? plusDisabled ? null : onPressPlus : null} activeOpacity={onPressPlus ? .5 : 1}>
		<Wrapper shadow style={{ backgroundColor: 'white', marginBottom: SizeList.base, borderRadius: 5, padding: SizeList.base }} spaceBetween>
			{
				manage_stock ?
					productImage ?
						<FastImage style={{ width: width * 0.17, height: width * 0.17, backgroundColor: ColorsList.greyAuthHard }} source={{ uri: productImage }} />
						:
						<ImageText name={name} />
					:
					productImage ?
						<FastImage
							style={{ width: width * 0.17, height: width * 0.17, backgroundColor: ColorsList.greyAuthHard }}
							source={{ uri: productImage, priority: FastImage.priority.high, }}

						/>
						:
						<ImageText name={name} />
			}
			<View style={{ marginHorizontal: SizeList.base }} _flex>
				<Text font="SemiBold" color="primary">{name.length > 25 ? name.substr(0, 25) + '...' : name}</Text>
				<Text style={[min_stock ? parseInt(stock) <= parseInt(min_stock) ? { color: ColorsList.danger } : (stock - quantity) <= min_stock ? { color: ColorsList.danger } : null : null]}>{stock ? `Stok : ${stock}` : "Fitur stok tidak aktif"}</Text>
				<Text>{price}</Text>
			</View>
			{
				right ? right : <View>
					<TouchableOpacity onPress={onPressPlus} disabled={plusDisabled} style={styles.cardPlusMinusIcon}>
						<Image style={{ width: 13, height: 13 }} source={require("src/assets/icons/plus.png")} />
					</TouchableOpacity>
					<Text font="SemiBold" style={{ marginHorizontal: 8, marginVertical: 4 }}>{quantity ? quantity : 0}</Text>
					<TouchableOpacity onPress={onPressMinus} style={styles.cardPlusMinusIcon}>
						<Image style={{ width: 13, height: 13 }} source={require("src/assets/icons/minus.png")} />
					</TouchableOpacity>
				</View>
			}
		</Wrapper>
	</TouchableOpacity>
}
export const ReturnTransactionCard = (props) => {
	return <View style={{ height: height / 7, backgroundColor: 'white', marginBottom: 10, borderRadius: 5 }}>
		<TouchableOpacity onPress={props.onPressMinus} disabled={props.minusDisabled}  style={[styles.card, props.cardStyle]}>
			<View style={{ ...RowChild, height: '100%', width: '90%' }}>
				{/* <View></View> */}
				<View style={{ width: '50%', paddingLeft: 10 }}>
					<Text font="SemiBold" color="primary">{props.name}</Text>
					<Text >{props.price}</Text>
				</View>
			</View>
			{
				props.right ? props.right :
					<View style={{ width: '10%', backgroundColor: '#f9faf7', height: '100%', justifyContent: "space-around", alignItems: "center", borderTopRightRadius: 5, borderBottomRightRadius: 5 }}>
						<TouchableOpacity onPress={props.onPressPlus} disabled={props.plusDisabled} style={styles.cardPlusMinusIcon}>
							<Icon size={15} name="plus" color={ColorsList.greyFont} />
						</TouchableOpacity>
						<Text font="SemiBold" style={{ marginHorizontal: 8, }}>{props.quantity ? props.quantity : 0}</Text>
						<TouchableOpacity onPress={props.onPressMinus} disabled={props.minusDisabled} style={styles.cardPlusMinusIcon}>
							<Icon size={15} name="minus" color={ColorsList.greyFont} />
						</TouchableOpacity>
					</View>
			}
		</TouchableOpacity>
	</View>
}

CardTextImage.propTypes = {
	onPressCard: PropTypes.func,
	style: ViewPropTypes.style,
	image: PropTypes.string,
	info: PropTypes.string
}

ImageText.propTypes = {
	size: PropTypes.number,
	style: ViewPropTypes.style,
	notGenerated: PropTypes.bool,
	name: PropTypes.string
}

ProductCard.propTypes = {
	manage_stock: PropTypes.bool,
	min_stock: PropTypes.string,
	name: PropTypes.string,
	onPressMinus: PropTypes.number,
	onPressPlus: PropTypes.number,
	plusDisabled: PropTypes.bool,
	price: PropTypes.string,
	productImage: PropTypes.string,
	quantity: PropTypes.string,
	right: PropTypes.bool,
	stock: PropTypes.string
}

ReturnTransactionCard.propTypes = {
	cardStyle: ViewPropTypes.style,
	minusDisabled: PropTypes.bool,
	name: PropTypes.string,
	onPressMinus: PropTypes.func,
	onPressPlus: PropTypes.func,
	plusDisabled: PropTypes.string,
	price: PropTypes.string,
	quantity: PropTypes.string,
	right: PropTypes.bool
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
		borderRadius: 5,

	}
})
