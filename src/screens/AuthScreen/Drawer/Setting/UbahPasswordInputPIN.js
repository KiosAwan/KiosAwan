import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import CodeInput from 'react-native-confirmation-code-input';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { SizeList } from '../../../../styles/size';
import { FontList } from '../../../../styles/typography';

const UbahPasswordInputPIN = ({ navigation }) => {
    const [pinCode, setPinCode] = useState()
    const _nextBtn = () => {
        navigation.navigate('MenuSettingUbahPassword', {
            PIN: pinCode
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <GlobalHeader title="Ubah Password" onPressBack={() => navigation.goBack()} />
            <View style={{ padding: 15, height: 120, backgroundColor: 'white', margin: 30, alignItems: "center" }}>
                <Text style={{ ...FontList.titleFont, color: ColorsList.greySoft }}>Masukkan PIN Anda</Text>
                <View>
                    <CodeInput
                        secureTextEntry
                        className='border-circle'
                        keyboardType="numeric"
                        activeColor='#cd0192'
                        inactiveColor='#cd0192'
                        codeLength={6}
                        // cellBorderWidth={0}
                        size={40}
                        autoFocus
                        onCodeChange
                        onFulfill={(code) => setPinCode(code)}
                    />
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_nextBtn}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
        </View>
    )
}

export default UbahPasswordInputPIN;