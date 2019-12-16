import React from 'react';
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

const NameRegistration = ({ navigation }) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()

    //Function handle change input and add to reducer
    const _handleChangeName = (name) => {
        dispatch(addName(name))
    }

    // Function handle press Next button
    const _handleNextButton = async () => {
        if (FormRegister.name == "") {
            alert("Nama tidak boleh kosong")
        } else {
            navigation.navigate('FirstPassword')
        }
    }


    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <BarStatus />
            <HeaderRegister
            />
            <View style={{ width: '70%', paddingTop: 30 }}>
                <Text style={{ textAlign: "center", color: 'white' }}>Enter your name so we can easily recognize you</Text>
            </View>
            <View style={styles.inputView}>
                <InputText
                    value={FormRegister.name}
                    label=""
                    handleChangeText={(name) => _handleChangeName(name)}
                />
            </View>
            <View style={{position : 'absolute', bottom : 10}}>
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