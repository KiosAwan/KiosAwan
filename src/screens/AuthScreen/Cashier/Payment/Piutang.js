import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'
import { ColorsList } from 'src/styles/colors';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { formatToDate } from 'src/utils/authhelper';
import { AddCashPayment, AddDebtDate } from 'src/redux/actions/actionsStoreProduct';
import DateTimePicker from "react-native-modal-datetime-picker";
import { PilihPelanggan } from 'src/components/Picker/SelectBoxModal';
import { Input } from 'src/components/Input/MDInput';
import { Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { SizeList } from 'src/styles/size';

const Piutang = ({ style }) => {
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
	return <Body>
		<DateTimePicker
			minimumDate={new Date()}
			isVisible={datePickerVisible}
			onConfirm={_handleDatePicked}
			onCancel={() => setDatePickerVisible(!datePickerVisible)}
		/>
		<PilihPelanggan action={(action, pelanggan) => {
			console.log(action, pelanggan)
		}} visible={modalVisible}
			data={Customer.data}
			dismiss={() => setModalVisible(false)}
		/>
		<Button style={{ marginBottom: SizeList.base }} padding={0} noRadius color="link" onPress={() => setModalVisible(true)}>
			<Input
				noLabel
				disabled
				style={{ width: '100%' }}
				value={Product.customer ? Product.customer.name_customer : "Nama pelanggan"}
				renderRightAccessory={() => <Icon color={ColorsList.greyFont} size={17} name="sort-down" />}
			/>
		</Button>
		<Input
			currency noLabel
			value={Product.cash_payment.toString()}
			placeholder="Uang diterima diawal"
			onChangeText={_handleChangeMoney}
		/>
		<Button style={{ marginTop: SizeList.base }} padding={0} noRadius color="link" onPress={() => setDatePickerVisible(!datePickerVisible)}>
			<Input
				noLabel
				disabled
				style={{ width: '100%' }}
				value={Product.due_debt_date ? formatToDate(Product.due_debt_date) : "Tanggal jatuh tempo"}
				renderRightAccessory={() => <Icon color={ColorsList.greyFont} name="calendar-plus" size={20} />}
			/>
		</Button>
	</Body>
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