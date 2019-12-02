import React, { useState } from 'react';
import DateTimePicker from "react-native-modal-datetime-picker";
import { useSelector, useDispatch } from 'react-redux'
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Card, Picker } from 'native-base'
import { convertRupiah, sendNewTransaction, validNumber, sendNewCustomer, formatToDate,  } from '../../utils/authhelper';
import { FlatList } from 'react-native-gesture-handler';
import { RowChild } from '../../components/Helper/RowChild';
import { InputWithLabel } from '../../components/Input/InputComp';
import { RegisterButton } from '../../components/Button/ButtonComp';
import AsyncStorage from '@react-native-community/async-storage'
import { removeAllCart, getProduct } from '../../redux/actions/actionsStoreProduct';
import { getTransactionList } from '../../redux/actions/actionsTransactionList';
import { getCustomer } from '../../redux/actions/actionsCustomer';

const CheckOut = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const Product = useSelector(state => state.Product)
    const Customer = useSelector(state => state.Customer)
    const [amount_payment, setAmountPayment] = useState()
    const [isDisabled, setIsDisabled] = useState(true)
    const [selectedCustomer, setSelectedCustomer] = useState()
    const [customerName, setCustomerName] = useState()
    const [customerPhone, setCustomerPhone] = useState()
    const [due_debt_date, setDebtDate] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [dataPickerVisible, setDatePickerVisible] = useState(false)
    const dispatch = useDispatch()

    const _handleCashPay = async () => {
        const userId = await AsyncStorage.getItem('userId')
        let cart = []
        Product.belanja.map(item => {
            if(item.id_product > 0) {
            let a = {
                id: item.id_product,
                qty: item.quantity,
            }
            cart.push(a)
            }else {
                let a = { 
                    name_product : item.name_product,
                    qty : item.quantity,
                    priceIn : item.price_in_product,
                    priceOut : item.price_out_product
                }
                cart.push(a)
            }   
        })
        const data = {
            cashier: userId,
            amount_payment,
            id_payment_type: 1,
            product_cart: cart,
            customer: selectedCustomer,
            id_store : User.store.id_store,
        }
        console.log(data)
        try {
            const res = await sendNewTransaction(data)
            console.log(res)
            dispatch(removeAllCart())
            dispatch(getProduct(User.store.id_store))
            dispatch(getTransactionList(User.store.id_store))
            navigation.navigate('Cashier')
        }
        catch (error) {
            alert('Kenapa si')
            // console.log(error.response.data.data.errors.msg)
        }

    }

    const _handleNgutang = async () => {
        if (!selectedCustomer) {
            alert("Ntar ditagih kemana kalau customernya kosong")
        }
        else if (!due_debt_date) {
            alert("Tanggal tidak boleh kosong")
        }
        else {
            const userId = await AsyncStorage.getItem('userId')
            let cart = []
            Product.belanja.map(item => {
                if(item.id_product > 0) {
                let a = {
                    id: item.id_product,
                    qty: item.quantity,
                    name_product : item.name_product
                }
                cart.push(a)
                }else {
                    let a = { 
                        name_product : item.name_product,
                        qty : item.quantity,
                        priceIn : item.price_in_product,
                        priceOut : item.price_out_product
                    }
                    cart.push(a)
                }   
            })
            const data = {
                cashier: userId,
                id_store : User.store.id_store,
                amount_payment: amount_payment ? amount_payment : 0,
                id_payment_type: 3,
                product_cart: cart,
                due_debt_date : formatToDate(due_debt_date),
                customer: selectedCustomer
            }
            const res = await sendNewTransaction(data)
            dispatch(removeAllCart())
            dispatch(getProduct(User.store.id_store))
            dispatch(getTransactionList(User.store.id_store))
            // navigation.navigate('Struk', {response : res.data}) 
            navigation.navigate('Cashier')
        }
    }

    const _handleChangePayment = async (text) => {
        let check = validNumber(text)
        if (check) {
            setAmountPayment(text)
            const a = parseInt(text) - parseInt(Product.total)
            a >= 0 ? setIsDisabled(false) : setIsDisabled(true)
        }
    }

    const _handleAddNewCustomer = async () => {
        const data = {
            name_customer: customerName,
            phone_number_customer: customerPhone,
            id_store: User.store.id_store
        }
        const res = await sendNewCustomer(data)
        dispatch(getCustomer(User.store.id_store))
        setModalVisible(!modalVisible)
    }

    const handleDatePicked = date => {
        setDebtDate(date)
        setDatePickerVisible(false)
      };
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={{ flex: 1, justifyContent: "center", padding: 70 }}>
                    <Card style={{ paddingVertical: 40, paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 20, textAlign: "center", paddingBottom: 30 }}>New Customer</Text>
                        <View style={{ borderWidth: 1, marginBottom: 10 }}>
                            <InputWithLabel
                                label="Customer Name"
                                value={customerName}
                                handleChangeText={(text) => setCustomerName(text)}
                            />
                            <InputWithLabel
                                label="Phone Number"
                                value={customerPhone}
                                keyboardType="numeric"
                                handleChangeText={(text) => setCustomerPhone(text)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20 }}>
                            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                <View>
                                    <Text>Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={_handleAddNewCustomer} >
                                <View>
                                    <Text>Add Customer</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </Card>
                </View>
            </Modal>
            <View>
                <Text>{Product.total}</Text>
                <Text>{Product.jumlahitem}</Text>
                <View style={styles.cartlist}>
                    <Text>Harga</Text>
                    <Text>Kuantitas</Text>
                </View>
                <FlatList
                    data={Product.belanja}
                    renderItem={({ item }) => (
                        <View style={styles.cartlist}>
                            <Text>Harga {convertRupiah(item.price_out_product)}</Text>
                            <Text>{item.quantity}</Text>
                        </View>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <RegisterButton
                buttonTitle="Add new Customer"
                onPressBtn={() => setModalVisible(true)}
            />
            <RegisterButton
            buttonTitle="Jatuh tempo"
            onPressBtn={() => setDatePickerVisible(!dataPickerVisible)}
            />
            <DateTimePicker
            isVisible={dataPickerVisible}
            onConfirm={handleDatePicked}
            onCancel={() => setDatePickerVisible(false)}
            />
            <Text>Tunai</Text>
            <View>
                <InputWithLabel
                    label="Amount Payment"
                    value={amount_payment}
                    handleChangeText={_handleChangePayment}
                    keyboardType="numeric"
                />
            </View>
            <Picker
                note
                mode="dropdown"
                style={{ width: 300 }}
                selectedValue={selectedCustomer}
                onValueChange={(value) => setSelectedCustomer(value)}
            >
                <Picker.Item label="Choose Customer" />
                {
                    Customer.data.map((item) => {
                        return (
                            <Picker.Item label={item.name_customer} value={item.id_customer} key={item.id_customer} />
                        );
                    })
                }
            </Picker>
            <RegisterButton
                disabled={isDisabled}
                buttonTitle="Bayar Cash"
                onPressBtn={_handleCashPay}
            />
            <RegisterButton
                buttonTitle="Ngutang"
                onPressBtn={_handleNgutang}
            />
        </View>
    )
}

export default CheckOut

const styles = StyleSheet.create({
    cartlist: {
        ...RowChild,
        justifyContent: "space-between"
    }
})