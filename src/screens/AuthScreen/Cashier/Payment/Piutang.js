import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { ColorsList } from 'src/styles/colors';
import { RowChild } from 'src/components/Helper/RowChild';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FloatingInputLabelCurrency } from 'src/components/Input/InputComp';
import { formatToDate } from 'src/utils/authhelper';
import { AddCashPayment, AddDebtDate } from 'src/redux/actions/actionsStoreProduct';
import DateTimePicker from "react-native-modal-datetime-picker";
import { PilihPelanggan } from 'src/components/Picker/SelectBoxModal';
import MDInput from 'src/components/Input/MDInput';

const Piutang = () => {
	const Customer = useSelector(state => state.Customer)
	const Product = useSelector(state => state.Product)
	const dispatch = useDispatch()
	const [modalVisible, setModalVisible] = useState(false)
	const [datePickerVisible, setDatePickerVisible] = useState(false)

	const _handleChangeMoney = (value) => {
		dispatch(AddCashPayment(value))
	}

	const _handleDatePicked = date => {
		dispatch(AddDebtDate(date))
	};
	return (
		<ScrollView style={styles.container}>
			<PilihPelanggan action={(action, pelanggan) => {
				console.log(action, pelanggan)
			}} visible={modalVisible}
				data={Customer.data}
				dismiss={() => setModalVisible(false)}
			/>
			<FloatingInputLabelCurrency
				value={Product.cash_payment.toString()}
				label="Uang diterima diawal"
				handleChangeText={_handleChangeMoney}
				keyboardType="number-pad"
			/>
			<View style={{ marginTop: 20 }}>
				<TouchableOpacity onPress={() => setModalVisible(true)}>
					<View style={[styles.wrapNamaPelanggan, { ...RowChild, justifyContent: 'space-between' }]}>
						<View>
							<Text style={styles.textNamaPelanggan}>{Product.customer ? Product.customer.name_customer : "Nama pelanggan"}</Text>
						</View>
						<Icon color={ColorsList.greyFont} size={17} name="chevron-down" />
					</View>
				</TouchableOpacity>
			</View>
			<DateTimePicker
				minimumDate={new Date()}
				isVisible={datePickerVisible}
				onConfirm={_handleDatePicked}
				onCancel={() => setDatePickerVisible(!datePickerVisible)}
			/>
			<View style={{ marginTop: 20 }}>
				<TouchableOpacity onPress={() => setDatePickerVisible(!datePickerVisible)}>
					<View style={[styles.wrapNamaPelanggan, { ...RowChild, justifyContent: 'space-between' }]}>
						<View>
							<Text style={styles.textNamaPelanggan}>{Product.due_debt_date ? formatToDate(Product.due_debt_date) : "Tanggal jatuh tempo"}</Text>
						</View>
						<Icon name="calendar-plus" size={20} />
					</View>
				</TouchableOpacity>
			</View>
		</ScrollView>
	)
}

export default Piutang;

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	},
	wrapNamaPelanggan: {
		width: '100%',
		fontFamily: 'Nunito-SemiBold',
		borderBottomWidth: 1,
		borderBottomColor: ColorsList.greySoft
	},
	textNamaPelanggan: {
		marginBottom: 5,
		fontFamily: 'Nunito-SemiBold',
		color: ColorsList.greyFont
	}
});