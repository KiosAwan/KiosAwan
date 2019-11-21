import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'
import { RegisterButton } from '../../components/Button/ButtonComp';
import { FlatList } from 'react-native-gesture-handler';

const Cashier = ({navigation}) =>  {
        return (
            <View style={{flex : 1}}>
                <Text>Cashier</Text>
                <RegisterButton
                buttonTitle="Ada Barcode"
                onPressBtn={()=> navigation.navigate('NewBarcode')}
                />
                <RegisterButton
                buttonTitle="Gaada Barcode"
                onPressBtn={()=> navigation.navigate('NewProductName')}
                />
                <FlatList
                data={}
                />
            </View>
        );
    }

export default Cashier