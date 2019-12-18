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
import BarStatus from '../../../../components/BarStatus';
import { GlobalHeader } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import {sendNewCustomer } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { getCustomer } from '../../../../redux/actions/actionsCustomer';


const height = Dimensions.get('window').height

const PelangganAdd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const User = useSelector(state => state.User)

    const _handleSaveNewCustomer = async () => {
        if (name == "") {
            alert("Nama tidak boleh kosong")
        }
        else {
            const res = await sendNewCustomer({
                id_store: User.store.id_store,
                name_customer: name,
                phone_number_customer : phone_number
            })
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
    return (
        <View style={styles.container} >
            <BarStatus />
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
                    image={require('../../../../assets/images/managemenpelanggansuccess.png')}
                    infoText="Tambah Pelanggan Berhasil!"
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