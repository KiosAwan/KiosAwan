import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
// Styling 
import {
    View,
    StyleSheet,
    Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own custom components
import { InputText } from '../../components/Input/InputComp'

//Redux Actions
import { addName } from '../../redux/actions/actionsRegistration'

//Functions
import { HeaderRegister } from '../../components/Header/Header';
import BarStatus from '../../components/BarStatus';
import { UnauthBottomButton } from '../../components/Button/UnauthButton';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { ColorsList } from '../../styles/colors';

const NameRegistration = ({ navigation }) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)
    //Function handle change input and add to reducer
    const _handleChangeName = (name) => {
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


    return (
        <LinearGradient colors={[ColorsList.primary, ColorsList.gradientPrimary]} style={styles.container} >
            <BarStatus />
            <HeaderRegister
            />
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <View style={{ width: '70%', paddingTop: 30 }}>
                <Text style={{ textAlign: "center", color: 'white' }}>Masukkan nama agar kami mudah mengenali Anda</Text>
            </View>
            <View style={styles.inputView}>
                <InputText
                    value={FormRegister.name}
                    label=""
                    handleChangeText={(name) => _handleChangeName(name)}
                />
            </View>
            <View style={{ position: 'absolute', bottom: 10 }}>
                <UnauthBottomButton
                    onPressBackBtn={() => navigation.goBack()}
                    onPressNextBtn={_handleNextButton}
                />
            </View>
        </LinearGradient>

    )
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