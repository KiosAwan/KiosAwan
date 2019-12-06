import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Spinner } from 'native-base'
import { GlobalHeader } from '../../components/Header/Header';
import LinearBackground from '../../components/LinearBackground';
import { RowChild } from '../../components/Helper/RowChild';
import { RowOpposite } from '../../components/Row/RowComp';
const Struk = ({ navigation }) => {
    const [response, setResponse] = useState()
    // useEffect(() => {
    //     _getResponse()
    // }, [])

    // const _getResponse = async () => {
    //     const { response } = await navigation.state.params
    //     setResponse(response)
    // }
    return (
        <View style={{ flex: 1 }}>
            {/* {response == undefined ? <Spinner color="#cd0192" /> : */}
            {/* <View style={{flex : 1}}> */}
            <LinearBackground
                content={
                    <View>
                        <Image source={{ uri: '' }} />
                        <Text style={{ fontFamily: 'Nunito-SemiBold', color: 'white', fontSize: 25 }}>Transaksi Berhasil</Text>
                        <Text style={{ fontFamily: 'Nunito-SemiBold', color: 'white', fontSize: 14, textAlign: 'center' }}>TRX-1231</Text>
                    </View>
                }
            />
            <View style={{ flex: 1, margin: 15 }}>
                <View style={{margin : 25}}>
                    <RowOpposite
                    title="Pembayaran" content="afdas"/>
                    <RowOpposite
                    title="Total Tagihan" content="afdas"/>
                    <RowOpposite
                    title="Tunai Diterima" content="afdas"/>
                    <RowOpposite
                    title="Kembalian" content="afdas"/>
                </View>

                {/* <Text>{response.id_payment_type}</Text>
                    <Text>{response.payment_code}</Text>
                    {response.status_payment == 2 ? <Text>Ngutang</Text> : <Text>Lunas</Text>}
                    <Text>Harga total : {response.total_payment}</Text>
                    <Text>Yang sudah dibayar : {response.amount_payment}</Text> */}
            </View>
            {/* </View> */}
            {/* } */}


        </View>
    )
}

export default Struk;

const styles = StyleSheet.create({
    rowOpposite : { 
        ...RowChild, 
        justifyContent: "space-between" 
    }
})