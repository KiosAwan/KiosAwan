import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Spinner } from 'native-base'
import { GlobalHeader } from '../../components/Header/Header';
import LinearBackground from '../../components/LinearBackground';
import { RowChild } from '../../components/Helper/RowChild';
import { RowOpposite } from '../../components/Row/RowComp';
import { ButtonWithIcon, BottomButton } from '../../components/Button/ButtonComp';
import { ColorsList } from '../../styles/colors';
import { SizeList } from '../../styles/size';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { FontList } from '../../styles/typography';
import { convertRupiah } from '../../utils/authhelper';
const Struk = ({ navigation }) => {
    let viewShot
    const [response, setResponse] = useState()
    useEffect(() => {
        _getResponse()
    }, [])

    const _getResponse = async () => {
        const { response } = await navigation.state.params
        console.debug(response)
        setResponse(response)
    }
    const _handleSelesai = () => {
        navigation.navigate('/cashier')
    }

    const _handleSendStruk = () => {
        navigation.navigate('/drawer/transaction/detail', {
            transactionId: response.id_transaction,
            backState: '/cashier'
        })
    }
    return (
        <View style={{ flex: 1 }}>
            {response == undefined ? <Spinner color="#cd0192" /> :
                <View style={{ flex: 1 }}>
                    <LinearBackground
                        content={
                            <View>
                                <Image style={{ width: 300, height: 200 }} source={require('../../assets/images/successtransaction.png')} />
                                <Text style={{ fontFamily: 'Nunito-SemiBold', color: 'white', fontSize: 20, textAlign: 'center' }}>Transaksi Berhasil !</Text>
                                <Text style={{ fontFamily: 'Nunito-SemiBold', color: 'white', fontSize: 16, textAlign: 'center' }}>{response.payment_code}</Text>
                            </View>
                        }
                    />
                    <View style={{ flex: 1, margin: 15 }}>
                        <View style={{ margin: 20 }}>
                            <RowOpposite
                                title="Pembayaran" content={response.id_payment_type == 1 ? "Tunai" : response.id_payment_type == 2 ? `NonTunai(${response.print.method})` : "Piutang"} />
                            <RowOpposite
                                title="Total Tagihan" content={convertRupiah(response.total_payment)} />
                            <RowOpposite
                                title="Tunai Diterima" content={convertRupiah(response.amount_payment)} />
                            <RowOpposite
                                title="Kembalian" content={convertRupiah(response.change_payment)} />
                        </View>

                        <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                            <View style={{ flexDirection: 'row', alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                <TouchableOpacity onPress={_handleSendStruk}>
                                    <View style={[styles.wrapIconText]} >
                                        <Icon color={ColorsList.primaryColor} size={16} style={{ marginRight: 5 }} name="paper-plane" />
                                        <Text style={styles.btnwithIconText}>Kirim Struk</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => navigation.navigate('/drawer/transaction/cetakstruk', {data : {transaction : response.print ,details_item : response.items }})}>
                                    <View style={[styles.wrapIconText]} >
                                        <Icon color={ColorsList.primaryColor} size={16} style={{ marginRight: 5 }} name="print" />
                                        <Text style={styles.btnwithIconText}>Cetak Struk</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <BottomButton
                                onPressBtn={_handleSelesai}
                                style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 30 }}
                                buttonTitle="SELESAI"
                            />
                        </View>
                    </View>
                </View>
            }
        </View>
    )
}

export default Struk;

const styles = StyleSheet.create({
    rowOpposite: {
        ...RowChild,
        justifyContent: "space-between"
    },
    wrapIconText: {
        borderRadius: 5,
        ...RowChild,
        padding: 8,
        width: (SizeList.width - 40) / 2,
        borderWidth: 1,
        justifyContent: "center",
        borderColor: ColorsList.primaryColor,
        borderRadius: 5,
    },
    btnwithIconText: {
        ...FontList.titleFont,
        fontSize: 12,
        color: ColorsList.primaryColor,
    },
})