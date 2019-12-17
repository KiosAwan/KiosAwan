import React from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { SizeList } from '../../../../styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { FontList } from '../../../../styles/typography';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { sendCodeToEmail } from '../../../../utils/authhelper';
const UbahNoHPInfoScreen = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const _nextBtn = async () => {
        const data = {
            email: User.data.email
        }
        await sendCodeToEmail(data)
        navigation.navigate('/drawer/settings/change-phone-number/otp-validation')
    }

    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <GlobalHeader title="Ubah No HP" onPressBack={() => navigation.goBack()} />
            <View style={{ padding: 30 }}>
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="No HP Anda">
                        <TextInput value={User.data.phone_number}
                            editable={false}
                        />
                        <Image style={{ width: 30, height: 30 }} source={require('../../../../assets/icons/successcheck.png')} />
                    </FloatingInput>
                </View>
                <View style={{ backgroundColor: ColorsList.successSoft, marginTop: 30 }}>
                    <Text style={{ textAlign: 'center', ...FontList.titleFont, color: ColorsList.success, padding: 5, paddingVertical : 10 }}>No. HP dapat diubah apabila dibutuhkan</Text>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_nextBtn}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="UBAH"
                />
            </View>
        </View>
    )
}

export default UbahNoHPInfoScreen