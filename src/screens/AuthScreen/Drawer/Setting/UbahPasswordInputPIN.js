import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { FontList } from '../../../../styles/typography';
import { verifyUserPIN } from '../../../../utils/authhelper';

const UbahPasswordInputPIN = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [pinCode, setPinCode] = useState()
    const _nextBtn = async () => {
        if (!pinCode) {
            alert("Pin tidak boleh kosong")
        } else {
            const data = {
                pin: pinCode,
                phone_number: User.data.phone_number
            }
            const res = await verifyUserPIN(data)
            if (res.status == 200) {
                navigation.navigate('/drawer/settings/change-password/change', {
                    PIN: pinCode
                })
            }
            else if (res.status == 400) {
                alert(res.data.errors.msg)
            }
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground, alignItems: "center" }}>
            <GlobalHeader title="Ubah Password" onPressBack={() => navigation.goBack()} />
            <View style={{ width: '70%', padding: 20 }}>
                <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 16 }}>Masukkan PIN</Text>
            </View>
            <View style={{ paddingHorizontal: 15, height: 80, backgroundColor: 'white', marginHorizontal: 30, alignItems: "center" }}>
                <CodeInput
                    secureTextEntry
                    className='border-circle'
                    keyboardType="numeric"
                    activeColor='#cd0192'
                    inactiveColor='#cd0192'
                    codeLength={4}
                    size={40}
                    autoFocus
                    onCodeChange
                    onFulfill={(code) => setPinCode(code)}
                />
            </View>
            <View style={{ width: '90%', padding: 10 }}>
                <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>PIN dibutuhkan untuk mengubah password</Text>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_nextBtn}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </View>
    )
}

export default UbahPasswordInputPIN;