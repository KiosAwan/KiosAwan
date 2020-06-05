import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Modal
} from 'react-native';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { sendNewCustomer, getUserToken } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { Input } from 'src/components/Input/MDInput';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container, { Footer, Body } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';

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
        <Container style={styles.container} >
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
            <Body>
                <Input label="Nama Pelanggan" value={name}
                    onChangeText={(text) => setName(text)}
                />
                <View style={{ marginTop: 10 }}>
                    <Input label="No Telepon" value={phone_number}
                        keyboardType="number-pad"
                        onChangeText={(text) => setPhoneNumber(text)}
                    />
                </View>
                <Text style={{ marginTop: SizeList.base }} align="center">Masukkan nama dan nomer telepon pelanggan</Text>
            </Body>
            <Footer>
                <Button onPress={_handleSaveNewCustomer}>
                    SIMPAN
               </Button>
            </Footer>
        </Container>
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