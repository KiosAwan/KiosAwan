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
import { InputPIN } from '../../../../components/Input/InputPIN';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { verifyUserPassword } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import { Icon } from 'native-base';


const height = Dimensions.get('window').height

const ChangePINInputPwd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [password, setPassword] = useState()
    const [secure , setSecure] = useState(true)
    const User = useSelector(state => state.User)

    const _handleNextBtn = async () => {
        const data = {
            phone_number : User.data.phone_number,
            password
        }
        const res = await verifyUserPassword(data)
        if(res.status == 200){
            navigation.navigate('/drawer/settings/change-pin/new-pin')
        }else if (res.status == 400){
            alert(res.data.errors.msg)
        }
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
                <View style={{ padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5}}>
                    <FloatingInput label="Password">
                        <TextInput value={password} 
                        secureTextEntry={secure}
                        onChangeText={(text) => setPassword(text)}
                        />
                    <Icon onPress={() => setSecure(!secure)} name={secure ? 'eye' : 'eye-off'} style={{color : ColorsList.greySoft}}/>

                    </FloatingInput>
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