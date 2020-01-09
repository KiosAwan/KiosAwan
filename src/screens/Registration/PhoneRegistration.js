import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import RBSheet from "react-native-raw-bottom-sheet";
import { getUniqueId } from 'react-native-device-info';

// Styling 
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

//Own custom components
import { InputNumber } from '../../components/Input/InputComp'
import VerifyOTPRegister from './OTPVerification';

//Redux Actions
import { addPhoneNumber, addDeviceId } from '../../redux/actions/actionsRegistration'

//Functions
import Strings from '../../utils/Strings'
import { sendPhoneNumber, phoneValidation } from '../../utils/unauthhelper';
import BarStatus from '../../components/BarStatus';
import { HeaderRegister } from '../../components/Header/Header';
import { BottomButton } from '../../components/Button/ButtonComp';
import { SizeList } from '../../styles/size';
import { FontList } from 'src/styles/typography';


const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const PhoneRegistration = ({ navigation }) => {
    const FormRegister = useSelector(state => state.Registration)
    const dispatch = useDispatch()
    let OTPRegisterSheet
    const [btnDisabled, setBtnDisabled] = useState(true)

    useEffect(() => {
        _getDeviceInfo()
    }, [])

    const _getDeviceInfo = async () => {
        let uniqueId = getUniqueId();
        await dispatch(addDeviceId(uniqueId))
    }
    //Function handle change input and add to reducer
    const _handleChangePhone = (number) => {
        if (number[0] != 0) {
            const checkNumber = phoneValidation("62" + number)
            if (checkNumber) {
                setBtnDisabled(false)
            } else {
                setBtnDisabled(true)
            }
            dispatch(addPhoneNumber(number))
        }
    }

    // Function handle press Next button
    const _handleSendPhoneNumber = async () => {
        const data = {
            phone_number: "62" + FormRegister.phone_number,
        }
        const res = await sendPhoneNumber(data)
        console.debug(res)
        if (res.type == "login") {
            navigation.navigate('/unauth/login')
        } else if (res.type == "register") {
            OTPRegisterSheet.open()
        }
        else {
            if (res.status == 400) {
                alert(res.data.errors.msg)
            }
        }
    }
    const _navigateRegister = () => {
        navigation.navigate('/unauth/registration')
    }

    return (
        <LinearGradient colors={['#cd0192', '#6d1d6d']} style={styles.container} >
            <BarStatus />
            {/* {Bottom sheet for verify OTP new user} */}
            <RBSheet
                ref={ref => {
                    OTPRegisterSheet = ref;
                }}
                height={height * 2 / 7}
                duration={250}
                animationType="slide"
                customStyles={{
                    container: {
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10
                    },
                }}
            >
                <View>
                    <VerifyOTPRegister navigateTo={_navigateRegister} closeSheet={() => OTPRegisterSheet.close()}
                        openSheet={() => OTPRegisterSheet.open()}
                    />
                </View>
            </RBSheet>
            <View style={{ flex: 1 }}>
                <View style={{ alignItems: "center", padding: 20 }}>
                    <View style={styles.wrapHeader}>
                        <HeaderRegister
                        />
                    </View>
                    <Text style={styles.subtitleEnterPhone}>{Strings.REGISTERPHONESUBTITLE}</Text>
                </View>
                <View style={styles.inputView}>
                    <InputNumber
                        inputWidth={width * 3 / 5}
                        value={FormRegister.phone_number}
                        handleChangeText={(phone) => _handleChangePhone(phone)}
                    />
                    <View style={styles.termAndCond}>
                        <Text style={{ color: "#e831ae", fontSize: 13, textAlign: "center" }}>{Strings.REGISTERTERM1}
                            <Text onPress={() => navigation.navigate('/unauth/registration/term-condition')} style={{ color: "white", fontSize: 13, textAlign: "center" }}>{Strings.REGISTERTERM2}</Text>
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    disabled={btnDisabled}
                    onPressBtn={_handleSendPhoneNumber}
                    style={{ borderWidth: 1, borderColor: btnDisabled ? '#cd0192' : 'white', width: SizeList.width - 20 }}
                    buttonTitle="LANJUT"
                />
            </View>
        </LinearGradient>

    )
}


export default PhoneRegistration

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
    },
    inputView: {
        alignItems: "center",
        justifyContent: "center",
    },
    validNotif: {
        textAlign: 'center',
        padding: 10,
        color: "red"
    },
    rowChild: {
        flexDirection: "row",
        alignItems: "center",
        width: '80%',
        justifyContent: "center"
    },
    subtitleEnterPhone: {
        ...FontList.titleFont,
        paddingTop: 10,
        paddingHorizontal: 20,
        color: 'white',
        textAlign: "center"
    },
    logoStyle: {
        height: 80,
        width: 150
    },
    termAndCond: {
        width: '80%',
        paddingTop: 30
    },
    wrapHeader: {
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "flex-end",
    }
})
