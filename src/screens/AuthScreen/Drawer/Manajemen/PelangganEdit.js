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
import BarStatus from '../../../../components/BarStatus';
import { GlobalHeaderWithIcon } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import {editCustomer, deleteCustomer } from '../../../../utils/authhelper';
import { BottomButton, Button } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { AwanPopup } from '../../../../components/ModalContent/Popups';
import { getCustomer } from '../../../../redux/actions/actionsCustomer';


const height = Dimensions.get('window').height

const PelangganEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState()
    const [phone_number, setPhoneNumber] = useState()
    const [customerId, setCustomerId] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState(false)
    const User = useSelector(state => state.User)

    useEffect(() => {
        _getParams()
    }, [])
    const _getParams = async () => {
        const { item } = navigation.state.params
        setName(item.name_customer)
        setPhoneNumber(item.phone_number_customer)
        setCustomerId(item.id_customer)
    }

    const _handleFinishEdit = async () => {
        if (name == "") {
            alert("Nama tidak boleh kosong")
        }
        else {
            const res = await editCustomer({
                name_customer: name,
                phone_number_customer : phone_number
            }, customerId)
            console.log(res)
            if (res.status == 201) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getCustomer(User.store.id_store))
                    setModalVisible(false)
                }, 1000)
            } else if (res.status == 400) {
                alert(res.data.errors.msg)
            }
        }
    }

    const _handleDeleteCustomer = async () => {
        setAlert(false)
        await deleteCustomer(customerId)
        setModalVisible(true)
        setTimeout(() => {
            navigation.goBack()
            dispatch(getCustomer(User.store.id_store))
            setModalVisible(false)
        }, 1000)
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <AwanPopup.Title title="Hapus Pelanggan" visible={alert} message={`${name} akan dihapus dari daftar pelanggan.`}>
                <View></View>
                <Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
                <Button onPress={_handleDeleteCustomer} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
            </AwanPopup.Title>
            <GlobalHeaderWithIcon
                onPressBack={() => navigation.goBack()}
                title="Edit Pelanggan"
                image={require('../../../../assets/icons/trash.png')}
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
                    image={require('../../../../assets/images/managemenpelanggansuccess.png')}
                    infoText="Edit Pelanggan Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Nama Pelanggan">
                        <TextInput value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </FloatingInput>
                    <View style={{marginTop : 10}}>
                        <FloatingInput label="No Telepon">
                            <TextInput value={phone_number}
                                keyboardType="number-pad"
                                onChangeText={(text) => setPhoneNumber(text)}
                            />
                        </FloatingInput>
                    </View>
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Ubah data pelanggan xx</Text>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleFinishEdit}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
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
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
        borderColor: "#03DAC6",
    },
})