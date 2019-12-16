import React, { Component } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { SizeList } from '../../../../styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { sendOTPAuth } from '../../../../utils/authhelper';
const UbahEmailInfoScreen = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const _nextBtn = async () => {
            const data = {
                phone_number : User.data.phone_number
            }
            await sendOTPAuth(data) 
            navigation.navigate('/drawer/settings/change-email/otp-validation')
    }
    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <GlobalHeader title="Ubah Email" />
            <View style={{ padding: 30 }}>
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Email Anda">
                        <TextInput value={User.data.email}
                            editable={false}
                        />
                        <Image style={{width : 30, height : 30}} source={require('../../../../assets/icons/checksuccess.png')} />
                    </FloatingInput>
                </View>
                <View style={{ backgroundColor: ColorsList.successSoft, marginTop: 30 }}>
                    <Text style={{ textAlign: 'center', ...FontList.subtitleFontGrey, color: ColorsList.success, padding: 5 }}>Email anda telah terverifikasi , tekan tombol dibawah untuk mengganti</Text>
                </View>
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

export default UbahEmailInfoScreen