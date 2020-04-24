import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput
} from 'react-native';
import BarStatus from '../../../../components/BarStatus';
import { GlobalHeader } from '../../../../components/Header/Header';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { verifyUserPassword } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { } from '../../../../components/Input/InputComp';
import { Icon } from 'native-base';
import MDInput from 'src/components/Input/MDInput';


const height = Dimensions.get('window').height

const ChangePINInputPwd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [password, setPassword] = useState()
    const [secure, setSecure] = useState(true)
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    const User = useSelector(state => state.User)

    const _handleNextBtn = async () => {
        const data = {
            phone_number: User.data.phone_number,
            password
        }
        const res = await verifyUserPassword(data)
        if (res.status == 200) {
            navigation.navigate('/drawer/settings/change-pin/new-pin')
        } else if (res.status == 400) {
            setAlertMessage(res.data.errors.msg)
            setAlert(true)
        }
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Ganti PIN"
            />
            <View style={{ alignItems: "center" }}>
                <View style={{ width: '70%', padding: 20 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 16 }}>Masukkan password</Text>
                </View>
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <MDInput label="Password" value={password}
                        secureTextEntry={secure}
                        onChangeText={(text) => setPassword(text)}
                        renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} name={secure ? 'eye' : 'eye-off'} style={{ color: ColorsList.greySoft }} />} />
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Password dibutuhkan untuk mengubah pin</Text>
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
        backgroundColor: ColorsList.authBackground
    },
    borderStyleBase: {
        width: 30,
        height: 45,
        borderRadius: 20
    },

    borderStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: ColorsList.successHighlight,
    },
})