import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { GlobalHeader } from 'src/components/Header/Header';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { verifyUserPassword } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import { Icon } from 'native-base';
import { Input } from 'src/components/Input/MDInput';
import Container, { Body } from 'src/components/View/Container';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';


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
        <Container header={{
            onPressBack: () => navigation.goBack(),
            title: "Ganti PIN"
        }}>
            <BarStatus />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <Body>
                <View style={{ alignItems: "center" }}>
                    <Input label="Password" value={password}
                        secureTextEntry={secure}
                        onChangeText={(text) => setPassword(text)}
                        renderRightAccessory={() => <Icon onPress={() => setSecure(!secure)} name={secure ? 'eye' : 'eye-off'} style={{ color: ColorsList.greySoft }} />} />
                    {/* </View> */}
                    <View style={{ width: '90%', padding: SizeList.padding }}>
                        <Text align="center">Password dibutuhkan untuk mengubah pin</Text>
                    </View>
                </View>
            </Body>
            <Bottom>
                <Button onPress={_handleNextBtn} width="100%">UBAH</Button>
            </Bottom>
        </Container>
    );
}

export default ChangePINInputPwd

const styles = StyleSheet.create({
})