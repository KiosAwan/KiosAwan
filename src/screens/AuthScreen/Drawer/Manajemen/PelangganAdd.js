import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Text,
    TextInput,
    Modal
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { sendNewCustomer, getUserToken } from 'src/utils/authhelper';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import MDInput from 'src/components/Input/MDInput';
import { AwanPopup } from 'src/components/ModalContent/Popups';

const PelangganAdd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const User = useSelector(state => state.User)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _handleSaveNewCustomer = async () => {
        if (name == "") {
            setAlertMessage("Nama tidak boleh kosong")
            setAlert(true)
        }
        else {
            const userToken = await getUserToken()
            const res = await sendNewCustomer({
                id_store: User.store.id_store,
                name_customer: name,
                phone_number_customer: phone_number
            })
            if (res.status == 201) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getCustomer(User.store.id_store, userToken))
                    setModalVisible(false)
                }, 1000)
            } else if (res.status == 400) {
                setAlertMessage(res.data.errors.msg)
                setAlert(true)
            }

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
                title="Tambah Pelanggan"
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            ><ModalContent
                    image={require('src/assets/images/managemenpelanggansuccess.png')}
                    infoText="Tambah Pelanggan Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <MDInput label="Nama Pelanggan" value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <View style={{ marginTop: 10 }}>
                        <MDInput label="No Telepon" value={phone_number}
                            keyboardType="number-pad"
                            onChangeText={(text) => setPhoneNumber(text)}
                        />
                    </View>
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Masukkan nama dan nomer telepon pelanggan</Text>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSaveNewCustomer}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
        </View>
    );
}

export default PelangganAdd

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