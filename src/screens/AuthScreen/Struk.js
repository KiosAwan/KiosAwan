import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import {Spinner} from 'native-base'
import { GlobalHeader } from '../../components/Header/Header';
const Struk = ({navigation}) => {
    const [response, setResponse] = useState()
    useEffect(() => { 
        _getResponse()
    }, [])

    const _getResponse = async () => {
        const {response} = await navigation.state.params
        setResponse(response)
    }
    return (
        <View>
            <GlobalHeader
            onPressBack={() => navigation.navigate('Cashier')}
            />
            {response ==undefined ? <Spinner color="#cd0192"/> : 
            <View>
            <Text>{response.id_payment_type}</Text>
            <Text>{response.payment_code}</Text>
            {response.status_payment == 2 ? <Text>Ngutang</Text> : <Text>Lunas</Text>}
            <Text>Harga total : {response.total_payment}</Text>
            <Text>Yang sudah dibayar : {response.amount_payment}</Text>       
            </View>
    }
            
        </View>
    )
}

export default Struk;