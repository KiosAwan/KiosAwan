import React, { useState } from 'react';
import { View, TextInput, Text, Image } from 'react-native';
import { SizeList } from '../../../../styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { sendOTPAuth } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { showPhoneNumber } from 'src/utils/unauthhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
const MenuSettingLupaPIN = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [apiLoading, setApiLoading] = useState(false)
    const _nextBtn = async () => {
        setApiLoading(true)
        const data = {
            phone_number: User.data.phone_number
        }
        await sendOTPAuth(data)
        setApiLoading(false)
        navigation.navigate('/drawer/settings/forgot-pin')
    }

    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <AwanPopup.Loading visible={apiLoading} />
            <GlobalHeader title="Lupa PIN" onPressBack={() => navigation.goBack()} />
            <View style={{ padding: 20 }}>
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5, alignItems :"center" }}>
                    <Text style={{...FontList.titleFont, color : ColorsList.greySoft, marginBottom : 15}}>Kode OTP akan dikirim melalui SMS ke</Text>
					<View style={{alignItems :"center", backgroundColor : ColorsList.greyAuthHard, padding : 10, width : '90%', borderRadius:5}}>
						<Text style={{...FontList.titleFont, fontSize : 20,color : ColorsList.greySoft}}>62- {showPhoneNumber(User.data.phone_number.slice(2,User.data.length))}</Text>
					</View>
                </View>
                <View style={{ backgroundColor: ColorsList.successSoft, marginTop: 30 }}>
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

export default MenuSettingLupaPIN