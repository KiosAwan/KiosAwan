import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Styling 
import {
    View,
    StyleSheet,
    Image,
    TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own custom components
import { InputText } from 'src/components/Input/InputComp'

//Redux Actions
import { addName } from 'src/redux/actions/actionsRegistration'

//Functions
import { HeaderRegister } from 'src/components/Header/Header';
import BarStatus from 'src/components/BarStatus';
import { UnauthBottomButton } from 'src/components/Button/UnauthButton';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from 'src/styles/colors';
import Container from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { Wrapper } from 'src/components/View/Wrapper';
import { Button } from 'src/components/Button/Button';
import UnauthHeader from 'src/components/View/UnauthHeader';

const NameRegistration = ({ navigation }) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()
    //alert
    const [alert, setAlert] = useState(false)
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [alertMessage, setAlertMessage] = useState(false)
    //Function handle change input and add to reducer
    const _handleChangeName = (name) => {
        if (name.length > 0) setBtnDisabled(false)
        else setBtnDisabled(true)
        dispatch(addName(name))
    }

    // Function handle press Next button
    const _handleNextButton = async () => {
        if (FormRegister.name == "") {
            setAlertMessage("Nama tidak boleh kosong")
            setAlert(true)
        } else {
            navigation.navigate('/unauth/registration/first-password')
        }
    }

    return <Container style={{ justifyContent: 'center', padding: 15 }}>
        <View style={{ marginBottom: 10, flex: 1 }}>
            <UnauthHeader />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <Text align="center">Masukkan nama lengkap agar kami mudah mengenali Anda.</Text>
            <TextInput
                autoFocus
                placeholder="Nama lengkap"
                value={FormRegister.name}
                onChangeText={(name) => _handleChangeName(name)}
                style={{ marginVertical: 10, color: ColorsList.greyFont, marginLeft: 5, elevation: 2, padding: 5, backgroundColor: ColorsList.authBackground }}
            />
        </View>
        <Button color={!btnDisabled ? 'primary' : ['transparent', 'transparent']} disabled={btnDisabled} radius={50} onPress={_handleNextButton}>LANJUT</Button>
    </Container>
}


export default NameRegistration

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center"
    },
    inputView: {
        alignItems: "center",
        justifyContent: "center"
    }
})