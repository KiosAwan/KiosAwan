import React, { useEffect, useState } from 'react'

import { TouchableOpacity, View, Text, Modal } from 'react-native';
import { Spinner, Card } from 'native-base'
import { getTransactionDetail, cancelTransaction, payCredit } from '../../utils/authhelper';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import { InputWithLabel } from '../../components/Input/InputComp';

const DetailTransaction = ({ navigation }) => {
    const [transactionId, setTransactionId] = useState('')
    const [data, setData] = useState()
    const [dataLoading, SetDataLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalCreditVisible, setModalCreditVisible] = useState(false)
    const [amount_payment, setAmountPayment] = useState()
    useEffect(() => {
        _getData()
    }, [])

    const _getData = async () => {
        const { transactionId } = await navigation.state.params
        const productData = await getTransactionDetail(transactionId)
        setTransactionId(transactionId)
        setData(productData.data)
        SetDataLoading(false)
    }

    const _handleCancelTransaction = async () => {
        navigation.navigate('/drawer/transaction/cancel-transaction', { id: transactionId })
    }

    const _handlePembayaranUtang = () => {
        setModalCreditVisible(true)
    }

    const _handleCetakStruk = () => {
        alert("Cetak Struk")
    }
    const _handlePayCredit = async () => {
        const userId = await AsyncStorage.getItem('userId')
        const data = {
            amount_payment,
            cashier: userId
        }
        try {
            const res = await payCredit(data, transactionId)
            const productData = await getTransactionDetail(transactionId)
            setData(productData.data)
            setModalCreditVisible(false)
        }
        catch (err) {
            alert("Mohon periksa kembali jaringan Anda")
        }
    }
    return (
        dataLoading ?
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}><Spinner color="#cd0192" /></View> :
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalCreditVisible}
                    onRequestClose={() => {
                        setModalCreditVisible(!modalCreditVisible);
                    }}>
                    <View style={{ flex: 1, justifyContent: "center", padding: 30 }}>
                        <Card style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                            <View style={{ borderWidth: 1, marginBottom: 10 }}>
                                <InputWithLabel
                                    label="Pay Amount"
                                    value={amount_payment}
                                    keyboardType="numeric"
                                    handleChangeText={(text) => setAmountPayment(text)}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 20 }}>
                                <TouchableOpacity onPress={() => setModalCreditVisible(!modalCreditVisible)}>
                                    <View>
                                        <Text>Cancel</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_handlePayCredit} >
                                    <View>
                                        <Text>Pay</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    </View>
                </Modal>

                {/* {Modal for pay credit} */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={{ flex: 1, justifyContent: "center", padding: 30 }}>
                        <Card style={{ paddingVertical: 30, paddingHorizontal: 10 }}>
                            <FlatList
                                data={data.debt_list}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text>Cashier : {item.action}</Text>
                                        <Text>Tanggal pembayaran : {item.date.slice(0, 10)}</Text>
                                        <Text>Amount : {item.amount_pay}</Text>
                                    </View>
                                )}
                                keyExtractor={(item, index) => index.toString()}
                            />
                            <RegisterButton
                                buttonTitle="OK"
                                onPressBtn={() => setModalVisible(false)}
                            />
                        </Card>
                    </View>
                </Modal>
                <Text>Kasir : {data.transaction.cashier}</Text>
                <Text>{data.transaction.payment_code}</Text>
                <Text>Tanggal transaksi : {data.transaction.created_at}</Text>
                <Text>Total : {data.transaction.total_transaction}</Text>
                <Text> {data.transaction.status_payment}</Text>
                {data.transaction.id_payment_type == 3 ?
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={{ width: 150, height: 80 }}>
                            <Text>Log pembayaran</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    null
                }

                <RegisterButton
                    buttonTitle="Batalkan Pembayaran"
                    onPressBtn={_handleCancelTransaction}
                />
                <RegisterButton
                    style={{ position: "absolute", bottom: 0 }}
                    buttonTitle={data.transaction.status_payment == 2 ? "Lakukan pembayaran" : "Cetak Struk"}
                    onPressBtn={data.transaction.status_payment == 2 ? _handlePembayaranUtang : _handleCetakStruk}
                />

            </View>
    )
}

export default DetailTransaction;

