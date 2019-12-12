import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
} from 'react-native';
import BarStatus from '../../../../components/BarStatus';
import { GlobalHeader } from '../../../../components/Header/Header';
import { InputPIN } from '../../../../components/Input/InputPIN';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { verifyUserPassword } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';


const height = Dimensions.get('window').height

const ChangePINInputPwd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [newPassword, setNewPassword] = useState()
    const FormRegister = useSelector(state => state.Registration)
    // //Sending OTP code to server
    const _handleChangePIN = (psw) => {
        setNewPassword(psw)
    }

    const _handleNextBtn = async () => {
        // const data = {

        // }
        // const res = await verifyUserPassword()
        navigation.navigate('ChangePINNewPIN')
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Ganti PIN"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', padding: 30 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 18 }}>Masukkan password</Text>
                </View>
                <View style={{padding : 20, width : SizeList.width - 60,backgroundColor : 'white', borderWidth : 1, borderColor: ColorsList.greySoft, borderRadius : 5}}>
                    <InputPIN
                        textColor={ColorsList.primaryColor}
                        placeholderTextColor={ColorsList.primaryColor}
                        inputWidth={200}
                        value={FormRegister.firstPIN}
                        position="left"
                        handleChangeText={(pin) => _handleChangePIN(pin)}
                    />
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleNextBtn}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    );
}

export default ChangePINInputPwd

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : ColorsList.authBackground
    },
    borderStyleBase: {
        width: 30,
        height: 45,
        borderRadius: 20
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})