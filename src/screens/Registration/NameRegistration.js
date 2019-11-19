import React  from 'react';
import { useDispatch , useSelector } from 'react-redux'
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
import Strings from '../../utils/Strings'
import { HeaderRegister } from '../../components/Header/Header';
import BarStatus from '../../components/BarStatus';

const NameRegistration = ({navigation}) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()

    //Function handle change input and add to reducer
    const _handleChangeName = (name) => {
        dispatch(addName(name))
    }

    // Function handle press Next button
    const _handleNextButton = async () => {
        if(FormRegister.name == "") {
            alert("Nama tidak boleh kosong")
        }else {
        navigation.navigate('FirstPIN')             
    }}


    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <BarStatus/>
            <HeaderRegister 
            onPressBack={() => navigation.goBack()}
            onPressNext={_handleNextButton}
            />
            <View style={{width : '70%', paddingTop : 30}}>
                <Text style={{textAlign : "center", color : 'white'}}>Enter your name so we can easily recognize you</Text>
            </View>
            <View style={styles.inputView}>
                <InputText
                value={FormRegister.name}
                label=""
                handleChangeText={(name) => _handleChangeName(name)}
                />
            </View>
        </LinearGradient>

    )
}


export default NameRegistration

const styles = StyleSheet.create({
    container : {
        flex : 1,
        alignItems : "center"
    },
    inputView : {
        alignItems : "center",
        justifyContent : "center"
    }
})