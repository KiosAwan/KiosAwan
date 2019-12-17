import React, { Component } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { SizeList } from '../../../../styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { BottomButton, Bottom, Button } from '../../../../components/Button/ButtonComp';
import { sendOTPAuth, resendVerifyEmail } from '../../../../utils/authhelper';
const UbahEmailInfoScreen = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const _nextBtn = async () => {
        const data = {
            phone_number: User.data.phone_number
        }
        await sendOTPAuth(data)
        navigation.navigate('/drawer/settings/change-email/otp-validation')
    }

    const _handleSendEmail = async () => {
        const data = {
            email : User.data.email
        }
        const res = await resendVerifyEmail(data)
        if(res.status == 400){
            alert(res.data.errors.msg)
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <GlobalHeader title="Ubah Email" onPressBack={() => navigation.goBack()} />
            <View style={{ padding: 30 }}>
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Email Anda">
                        <TextInput value={User.data.email}
                            editable={false}
                        />
                        <Image style={{ width: 30, height: 30 }} source={User.data.status == 0 ? require('../../../../assets/icons/rejectcheck.png') : require('../../../../assets/icons/successcheck.png')} />
                    </FloatingInput>
                </View>
                {User.data.status == 0 ?
                    <View style={{ backgroundColor: ColorsList.dangerSoft, marginTop: 30 }}>
                        <Text style={{ textAlign: 'center', ...FontList.subtitleFontGrey, color: ColorsList.danger, padding: 5 }}>Email anda belum terverifikasi ,mohon segera verifikasi email Anda</Text>
                    </View> :
                    <View style={{ backgroundColor: ColorsList.successSoft, marginTop: 30 }}>
                        <Text style={{ textAlign: 'center', ...FontList.subtitleFontGrey, color: ColorsList.success, padding: 5 }}>Email anda telah terverifikasi , tekan tombol dibawah untuk mengganti</Text>
                    </View>
                }
            </View>
            {
                User.data.status == 0 ?
                    <Bottom>
                        <Button onPress={_handleSendEmail} color="white" style={{width : '47.5%'}}>Kirim Ulang</Button>
                        <Button onPress={() => navigation.navigate('/drawer/settings/change-email/new-email')} style={{width : '47.5%'}}>Ubah Email</Button>
                    </Bottom>
                    :
                    <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>

                        <BottomButton
                            onPressBtn={_nextBtn}
                            style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                            buttonTitle="LANJUT"
                        />
                    </View>

            }
        </View>
    )
}

export default UbahEmailInfoScreen