import React, { useState } from 'react';
import { View, Image } from 'react-native';
import { SizeList } from 'src/styles/size';
import { useSelector } from 'react-redux'
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { FontList } from 'src/styles/typography';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { sendCodeToEmail } from 'src/utils/authhelper';
import { showPhoneNumber } from 'src/utils/unauthhelper';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import MDInput, { Input } from 'src/components/Input/MDInput';
import { Text } from 'src/components/Text/CustomText';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
const UbahNoHPInfoScreen = ({ navigation }) => {
    const User = useSelector(state => state.User)
    const [apiLoading, setApiLoading] = useState(false)

    const _nextBtn = async () => {
        setApiLoading(true)
        const data = {
            email: User.data.email
        }
        await sendCodeToEmail(data)
        setApiLoading(false)
        navigation.navigate('/drawer/settings/change-phone-number/otp-validation')
    }

    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground }}>
            <AwanPopup.Loading visible={apiLoading} />
            <GlobalHeader title="Ubah No HP" onPressBack={() => navigation.goBack()} />
            <View style={{ padding: 20 }}>
                <Input label="No.Handphone Anda" value={`62-${showPhoneNumber(User.data.phone_number.slice(2, User.data.length))}`}
                    editable={false}
                    renderRightAccessory={() =>
                        <Image style={{ width: 30, height: 30 }} source={User.data.status == 0 ? require('src/assets/icons/rejectcheck.png') : require('src/assets/icons/successcheck.png')} />} />
                <View style={{ backgroundColor: ColorsList.successSoft, marginTop: SizeList.base, padding: SizeList.padding, borderRadius: SizeList.borderRadius }}>
                    <Text color="success">No. HP dapat diubah apabila dibutuhkan</Text>
                </View>
            </View>
            <Bottom>
                <Button onPress={_nextBtn} width="100%">UBAH</Button>
            </Bottom>
        </View>
    )
}

export default UbahNoHPInfoScreen