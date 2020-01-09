import React from 'react'
import { View,Text, Dimensions,TouchableOpacity } from 'react-native';
import { ColorsList } from '../../styles/colors';
import { Button } from 'native-base';

const width = Dimensions.get('window').width

export const UnauthBottomButton = (props) => {
    return (
        <View style={{flexDirection : 'row', justifyContent : 'space-between'}}>
            <TouchableOpacity
                onPress={props.onPressBackBtn}
                style={{ width: (width - 40)/2, alignItems: "center", justifyContent: "center", backgroundColor: 'transparent', borderRadius: 5 }}
            >
                <Text style={{fontFamily: 'Nunito-SemiBold',color : 'white'}}>KEMBALI</Text>
            </TouchableOpacity>
            <Button
                primary
                onPress={props.onPressNextBtn}
                style={{ width: (width - 40)/2, justifyContent: "center", backgroundColor: 'transparent', borderRadius: 5, borderWidth: 1,borderColor: 'white', }}
            >
                <Text style={{fontFamily: 'Nunito-SemiBold',color : 'white'}}>{props.login ? "LOGIN" : "LANJUT"}</Text>
            </Button>
        </View>

    )
}