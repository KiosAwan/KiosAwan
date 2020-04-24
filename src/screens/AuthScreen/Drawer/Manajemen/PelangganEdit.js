import React, { useState, useEffect } from 'react';
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
import { GlobalHeaderWithIcon } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { editCustomer, deleteCustomer } from 'src/utils/authhelper';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { getCustomer } from 'src/redux/actions/actionsCustomer';
import { Bottom } from 'src/components/View/Bottom';
import { Button } from 'src/components/Button/Button';
import MDInput from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';


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
            const res = await editCustomer({
                name_customer: form.name_customer,
                phone_number_customer: form.phone_number_customer
            }, form.id_customer)
            if (res.status == 201) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getCustomer(User.store.id_store))
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
        await deleteCustomer(form.id_customer)
        setModalVisible(true)
        setTimeout(() => {
            navigation.goBack()
            dispatch(getCustomer(User.store.id_store))
            setModalVisible(false)
        }, 1000)
    }
    return (
        <View style={styles.container} >
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <BarStatus />
            <AwanPopup.Title title="Hapus Pelanggan" visible={alertDel} message={`${form.name_customer} akan dihapus dari daftar pelanggan.`}>
                <View></View>
                <Button onPress={() => setAlertDel(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
                <Button onPress={_handleDeleteCustomer} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
            </AwanPopup.Title>
            <GlobalHeaderWithIcon
                onPressBack={() => navigation.goBack()}
                title="Edit Pelanggan"
                image={require('src/assets/icons/trash.png')}
                handleDeleteCategory={() => setAlert(true)}
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
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <MDInput label="Nama Pelanggan" value={form.name_customer}
                        onChangeText={name_customer => setForm({ name_customer })}
                    />
                    <View style={{ marginTop: 10 }}>
                        <MDInput label="No Telepon" value={form.phone_number_customer}
                            keyboardType="number-pad"
                            onChangeText={phone_number_customer => setForm({ phone_number_customer })}
                        />
                    </View>
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Ubah data pelanggan</Text>
                </View>
            </View>
            <Bottom>
                <Button width="100%" onPress={_handleFinishEdit}>SIMPAN</Button>
            </Bottom>
        </View>
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