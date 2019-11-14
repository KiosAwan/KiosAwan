import React , { useState } from 'react';
import { useDispatch , useSelector } from 'react-redux'
import RBSheet from "react-native-raw-bottom-sheet";
// Styling 
import { 
    View, 
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    Image,
    StatusBar
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own custom components
import { InputNumber } from '../../components/Input/InputComp'
import LoginVerification from './LoginVerification'
import VerifyOTPRegister from './OTPVerification';

//Redux Actions
import { addPhoneNumber} from '../../redux/actions/actionsRegistration'

//Functions
import Strings from '../../utils/Strings'
import { sendPhoneNumber, phoneValidation } from '../../utils/unauthhelper';
import { ColorsList } from '../../styles/colors';


const width  = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PhoneRegistration = ({navigation}) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()
    let VerifyLoginSheet
    let OTPRegisterSheet

    const [btnDisabled , setBtnDisabled] = useState(true)
    //Function handle change input and add to reducer
    const _handleChangePhone = (number) => {
        if(number[0] != 0) {
        const checkNumber = phoneValidation("62"+number)
        if(checkNumber) {
            setBtnDisabled(false)
        }else {
            setBtnDisabled(true)
        }
        dispatch(addPhoneNumber(number))
    }}

    // Function handle press Next button
    const _handleSendPhoneNumber = async () => {
        const data = {
            phone_number : "62"+FormRegister.phone_number,
        }
        const res = await sendPhoneNumber(data)
        if(res.type == "login") {
            VerifyLoginSheet.open()
        }else if(res.type == "register") {
            OTPRegisterSheet.open()
        }
        else {
            if(res.data.errors) {
                alert(res.data.errors.msg)
            }
        }
    }
    const _navigateForgotPIN = () => {        
        navigation.navigate("ForgotPIN")
    }
    const _navigateHome = () => {
        navigation.navigate('Home') 
    }
    const _navigateRegister = () => {
        navigation.navigate('NameRegistration') 
    }
    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <StatusBar
                backgroundColor={ColorsList.primaryColor}/>
            {/* {Bottom Sheet for Login} */}
                <RBSheet
                ref={ref => {
                    VerifyLoginSheet = ref;
                }}
                height={height*2/7}
                duration={250}
                animationType="slide"
                customStyles={{
                    container: {
                    borderTopLeftRadius : 10,
                    borderTopRightRadius : 10
                    },
                }}
                >
                    <View>
                        <LoginVerification 
                        navigationHome={_navigateHome} 
                        navigationForgot={_navigateForgotPIN}
                        closeLoginSheet={() => VerifyLoginSheet.close()}
                        />
                    </View>
                </RBSheet>
                {/* {Bottom sheet for verify OTP new user} */}
                <RBSheet
                ref={ref => {
                    OTPRegisterSheet = ref;
                }}
                height={height*2/7}
                duration={250}
                animationType="slide"
                customStyles={{
                    container: {
                    borderTopLeftRadius : 10,
                    borderTopRightRadius : 10
                    },
                }}
                >
                    <View>
                        <VerifyOTPRegister navigateTo={_navigateRegister} closeSheet={() =>  OTPRegisterSheet.close()}
                         openSheet={() =>  OTPRegisterSheet.open()}
                        />
                    </View>
                </RBSheet>
            <View style={{flex : 1}}>
                <View style={{alignItems : "center", padding: 20}}>
                    <View style={styles.wrapHeader}>
                        <View style={{flex : 1}}></View>
                        <View style={{flex : 2, alignItems : "center"}}>
                            <Image style={styles.logoStyle} source={require('../../assets/images/logo.png')}/>
                        </View>
                        <View style={{flex : 1, alignItems: 'flex-end',paddingBottom:10}}>
                            <TouchableOpacity disabled={btnDisabled}
                            onPress={_handleSendPhoneNumber}
                            style={{padding : 20}}
                            >
                                <Text style={{color : btnDisabled ? 'grey': 'white'}}>Next</Text>
                            </TouchableOpacity> 
                        </View>         
                    </View>                   
                    <Text style={styles.subtitleEnterPhone}>{Strings.REGISTERPHONESUBTITLE}</Text>
                </View>                     
                <View style={styles.inputView}>
                        <InputNumber
                        inputWidth={width*3/5}
                        value={FormRegister.phone_number}
                        handleChangeText={(phone) => _handleChangePhone(phone)}
                        />
                    <View style={styles.termAndCond}>
                            <Text style={{color : "#e831ae", fontSize : 13, textAlign : "center"}}>{Strings.REGISTERTERM1} 
                            <Text style={{color : "white",fontSize :13, textAlign : "center"}}>{Strings.REGISTERTERM2}</Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{flex : 1}}></View>
        </LinearGradient>

    )
}


export default PhoneRegistration

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : "center",
    },
    inputView : {
        alignItems : "center",
        justifyContent : "center",
    },
    validNotif : {
        textAlign: 'center',
        padding : 10,
        color : "red"
    },
    rowChild : {
        flexDirection : "row",
        alignItems : "center",
        width : '80%',
        justifyContent : "center"
    },
    subtitleEnterPhone : {
        paddingTop : 10,
        paddingHorizontal : 20, 
        color : 'white', 
        textAlign : "center"
    },
    logoStyle : {
        height : 80, 
        width : 150
    },
    termAndCond : {
        width : '80%', 
        paddingTop : 10
    },
    wrapHeader : {
        flexDirection :'row', 
        justifyContent : "center", 
        alignItems : "flex-end",
    }
})
