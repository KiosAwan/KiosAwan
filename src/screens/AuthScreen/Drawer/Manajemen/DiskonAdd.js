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
import { addNewDiscount } from 'src/utils/authhelper';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { ToggleButton } from 'src/components/Picker/SelectBoxModal';
import { getDiscount } from 'src/redux/actions/actionsDiscount';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import MDInput from 'src/components/Input/MDInput';


const height = Dimensions.get('window').height

const DiskonAdd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [discount_type, setDiscountType] = useState(0)
    const [value, setValue] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const User = useSelector(state => state.User)

    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _handleSaveNewDiscount = async () => {
        if (name == "" || value == "") {
            setAlertMessage("Harap isi semua kolom")
            setAlert(true)
        }
        else {
            const res = await addNewDiscount({
                id_store: User.store.id_store,
                discount: name,
                value: discount_type == 1 ? value / 100 : value,
                discount_type
            })
            if (res.status == 201) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getDiscount(User.store.id_store))
                    setModalVisible(false)
                }, 1000)
            } else if (res.status == 400) {
                setAlertMessage(res.data.errors.msg)
                setAlert(true)
            }

        }

    }

    const _handleChangeDiskon = (num) => {
        if (discount_type == 1) {
            if (num < 100 && num > 0) {
                setValue(num)
            } else {
                setValue("")
            }
        } else {
            if (num > 0 && num < 10000000000) {
                setValue(num)
            } else {
                setValue('')
            }
        }
    }
    return (
        <View style={styles.container} >
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Tambah Diskon"
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            ><ModalContent
                    image={require('src/assets/images/managemendiskonsuccess.png')}
                    infoText="Tambah Diskon Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <MDInput label="Nama diskon"
                        value={name}
                        onChangeText={(text) => setName(text)}
                    />
                    <View style={{ marginTop: 10 }}>
                        <MDInput label="Diskon" value={value}
                            style={{ width: '80%' }}
                            keyboardType="number-pad"
                            onChangeText={_handleChangeDiskon}
                            renderRightAccessory={() =>
                                <View style={{ width: '20%' }}>
                                    <ToggleButton
                                        buttons={["Rp", "%"]}
                                        changeToggle={(i) => {
                                            setDiscountType(i)
                                        }}
                                    />
                                </View>} />
                    </View>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSaveNewDiscount}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
        </View>
    );
}

export default DiskonAdd

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