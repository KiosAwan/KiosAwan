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
import { editDiscount, deleteDiscount, validNumber } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { AwanPopup } from '../../../../components/ModalContent/Popups';
import { ToggleButton } from '../../../../components/Picker/SelectBoxModal';
import { getDiscount } from '../../../../redux/actions/actionsDiscount';
import { Button } from 'src/components/Button/Button';
import { Bottom } from 'src/components/View/Bottom';


const height = Dimensions.get('window').height

const DiskonEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [idDiscount, setIdDiscount] = useState()
    const [discount_type, setDiscountType] = useState(0)
    const [value, setValue] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState(false)
    const User = useSelector(state => state.User)

    useEffect(() => {
        _getParams()
    }, [])
    const _getParams = async () => {
        const { item } = await navigation.state.params
        setName(item.name_discount)
        setValue((item.value * 100).toString())
        setDiscountType(item.discount_type)
        setIdDiscount(item.id_discount)
    }

    const _handleFinishEdit = async () => {
        if (name == "" || value == "" || value == 0) {
            alert("Isi semua kolom dengan benar")
        }
        else {
            const res = await editDiscount({
                discount: name,
                value: discount_type == 1 ? value / 100 : value,
                discount_type
            }, idDiscount)
            if (res.status == 200) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getDiscount(User.store.id_store))
                    setModalVisible(false)
                }, 1000)
            } else if (res.status == 400) {
                alert(res.data.errors.msg)
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
    const _handleDeleteDiskon = async () => {
        setAlert(false)
        const res = await deleteDiscount(idDiscount)
        if (res.status == 200) {
            setModalVisible(true)
            setTimeout(() => {
                navigation.goBack()
                dispatch(getDiscount(User.store.id_store))
                setModalVisible(false)
            }, 1000)
        }
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <AwanPopup.Title title="Hapus Diskon" visible={alert} message={`${name} akan dihapus dari daftar diskon.`}>
                <View></View>
                <Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
                <Button onPress={_handleDeleteDiskon} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
            </AwanPopup.Title>
            <GlobalHeaderWithIcon
                onPressBack={() => navigation.goBack()}
                title="Edit Diskon"
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
                    image={require('../../../../assets/images/managemendiskonsuccess.png')}
                    infoText="Edit Diskon Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Nama diskon">
                        <TextInput value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </FloatingInput>
                    <View style={{ marginTop: 10 }}>
                        <FloatingInput label="Diskon">
                            <TextInput value={value}
                                keyboardType="number-pad"
                                onChangeText={_handleChangeDiskon}
                            />
                            <View style={{ width: '20%' }}>
                                <ToggleButton
                                    toggle={discount_type}
                                    buttons={["Rp", "%"]}
                                    changeToggle={(i) => {
                                        setDiscountType(i)
                                    }}
                                />
                            </View>
                        </FloatingInput>
                    </View>
                </View>
            </View>
            <Bottom>
                <Button onPress={_handleFinishEdit}>SIMPAN</Button>
            </Bottom>
        </View>
    );
}

export default DiskonEdit

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