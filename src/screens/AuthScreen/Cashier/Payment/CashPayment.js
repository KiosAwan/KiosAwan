import React from "react"
import { View, StyleSheet } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import { ToggleButtonMoney } from "src/components/Picker/SelectBoxModal"
import { ColorsList } from "src/styles/colors"
import { FontList } from "src/styles/typography"
import {
	convertRupiah,
	getNearestFifty,
	validNumber,
} from "src/utils/authhelper"
import { RowChild } from "src/components/Helper/RowChild"
import { AddCashPayment } from "src/redux/actions/actionsStoreProduct"
import { SizeList } from "src/styles/size"
import { Input } from "src/components/Input/MDInput"
import { Text } from "src/components/Text/CustomText"
import { Body } from "src/components/View/Container"

const CashPayment = props => {
	const Product = useSelector(state => state.Product)
	const dispatch = useDispatch()

	const _handleChangePayment = text => {
		let x = text.extractNumber()
		dispatch(AddCashPayment(parseInt(x)))
	}
	return (
		<Body>
			<View style={[styles.container, props.style]}>
				<Input
					style={{ margin: 0 }}
					currency
					noShadow
					value={Product.cash_payment.toString()}
					onChangeText={_handleChangePayment}
					label="Uang yang diterima"
					keyboardType="number-pad"
				/>
				{Product.cash_payment -
					(parseInt(Product.total) - parseInt(Product.total_diskon)) >=
				0 ? (
					<Text style={styles.firstRouteKembalian}>
						Kembalian{" "}
						{convertRupiah(
							Product.cash_payment -
								(parseInt(Product.total) - parseInt(Product.total_diskon)),
						)}
					</Text>
				) : (
					<Text style={styles.firstRouteKembalian}>
						Kembalian {convertRupiah(0)}
					</Text>
				)}
				<View style={{ ...RowChild, marginTop: SizeList.base }}>
					<ToggleButtonMoney
						buttons={[
							Product.total - Product.total_diskon,
							getNearestFifty(Product.total - Product.total_diskon, 1),
						]}
					/>
				</View>
			</View>
		</Body>
	)
}

export default CashPayment

const styles = StyleSheet.create({
	container: {
		marginTop: SizeList.base,
		padding: SizeList.base,
		backgroundColor: ColorsList.white,
		borderRadius: SizeList.borderRadius,
		borderWidth: SizeList.borderWidth,
		borderColor: ColorsList.borderColor,
	},
	tabBar: {
		flexDirection: "row",
		borderColor: ColorsList.primary,
		alignItems: "center",
		height: 30,
		borderWidth: 1,
		borderRadius: 4,
	},
	firstRouteKembalian: {
		margin: 10,
	},
})
