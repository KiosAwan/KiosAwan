import React from 'react'
import { View } from 'react-native';
import { Text } from 'src/components/Text/CustomText';
import PinView from 'react-native-pin-view';
import { ColorsList } from 'src/styles/colors';
import LinearGradient from 'react-native-linear-gradient';

const EnterPIN = ({ navigation }) => {
    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={{ flex: 1, justifyContent: "space-around", backgroundColor : ColorsList.primary }}>
            <Text color="whiteColor" size={20} style={{ alignSelf: 'center', }}>Enter your PIN</Text>
            <PinView
                onComplete={(val, clear) => { alert(val) }}
                pinLength={4}
                buttonDeletePosition="right"
                keyboardViewStyle={{backgroundColor : 'transparent', borderWidth : 1, borderColor : ColorsList.whiteColor}}
                // inputBgColor={ColorsList.whiteColor}
                keyboardViewTextStyle={{color : ColorsList.whiteColor}}
                inputActiveBgColor={ColorsList.whiteColor}
            />
        </LinearGradient>
    )
}

export default EnterPIN;