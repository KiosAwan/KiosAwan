import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableOpacity
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { GlobalHeaderWithIcon, GlobalHeader, IconHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { editCustomer, deleteCustomer, getUserToken } from 'src/utils/authhelper';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { Button } from 'src/components/Button/Button';
import { Input } from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';


const height = Dimensions.get('window').height

const PelangganEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [form, setForm] = stateObject(navigation.state.params.item)
    const [modalVisible, setModalVisible] = useState(false)
    const [alertDel, setAlertDel] = useState(false)
    const User = useSelector(state => state.User)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)


    const _handleFinishEdit = async () => {
        if (form.name_customer == "") {
            setAlertMessage("Nama tidak boleh kosong")
            setAlert(true)
        } else {
            const userToken = await getUserToken()
            const res = await editCustomer({
                name_customer: form.name_customer,
                phone_number_customer: form.phone_number_customer
            }, form.id_customer)
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

    const _handleDeleteCustomer = async () => {
        setAlertDel(false)
        const res = await deleteCustomer(form.id_customer)
        const userToken = await getUserToken()
        console.debug(res)
        if (res.status == 200) {
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
    return (
        <Container >
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <BarStatus />
            <AwanPopup.Title title="Hapus Pelanggan" visible={alertDel} message={`${form.name_customer} akan dihapus dari daftar pelanggan.`}>
                <View></View>
                <Button onPress={() => setAlertDel(false)} style={{ width: '25%' }} color="link">Batal</Button>
                <Button onPress={_handleDeleteCustomer} style={{ width: '25%' }}>Ya</Button>
            </AwanPopup.Title>
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Edit Pelanggan"
                renderRightAccessory={() => <TouchableOpacity onPress={() => setAlertDel(true)}>
                    <IconHeader name="trash" color={ColorsList.greyFont} />
                </TouchableOpacity>}
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
                    infoText="Edit Pelanggan Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <Body>
                <Input label="Nama Pelanggan" value={form.name_customer}
                    onChangeText={name_customer => setForm({ name_customer })}
                />
                <View style={{ marginTop: 10 }}>
                    <Input label="No Telepon" value={form.phone_number_customer}
                        keyboardType="number-pad"
                        onChangeText={phone_number_customer => setForm({ phone_number_customer })}
                    />
                </View>
                <Text align="center" style={{ marginTop: SizeList.base }}>Ubah data pelanggan</Text>
            </Body>
            <Footer>
                <Button width="100%" onPress={_handleFinishEdit}>SIMPAN</Button>
            </Footer>
        </Container>
    );
}

export default PelangganEdit

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