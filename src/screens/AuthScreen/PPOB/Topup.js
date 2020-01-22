import React from 'react'
import { View, Text } from 'react-native';

const Topup = ({navigation}) => {
    return (
        <View>
            <Text onPress={() => navigation.navigate('/ppob/topup/detail')}>Topup</Text>
        </View>
    )
}

export default Topup;