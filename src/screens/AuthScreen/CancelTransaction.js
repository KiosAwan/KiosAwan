import React, { useEffect } from 'react'
import {
    View,
    Text
} from 'react-native';

const CancelTransaction = ({ navigation }) => {
    useEffect(() => {
        _getParams()
    }, [])

    const _getParams = () => {
        const { id } = navigation.state.params
        console.log(id)
    }
    return (
        <View>
            <Text>Mau cancel yak ?</Text>
        </View>
    )
}

export default CancelTransaction;