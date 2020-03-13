import React, {  } from 'react'
import { Text } from 'src/components/Text/CustomText';
// import PinView from 'react-native-pin-view';
import { ColorsList } from 'src/styles/colors';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativePinView from "react-native-pin-view"

const EnterPIN = () => {
    return <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: ColorsList.primary
    }}>
        <Text color="whiteColor" size={20} style={{ alignSelf: 'center', }}>Enter your PIN</Text>
            <ReactNativePinView
                onComplete={(val) => { alert(val) }}
                pinLength={4}
                inputSize={10}
                buttonDeletePosition="right"
                keyboardViewStyle={{backgroundColor : 'transparent', borderWidth : 1, borderColor : ColorsList.whiteColor}}
                // inputBgColor={ColorsList.whiteColor}
                keyboardViewTextStyle={{color : ColorsList.whiteColor}}
                inputActiveBgColor={ColorsList.whiteColor}
            />
    </LinearGradient>
}

export default EnterPIN;