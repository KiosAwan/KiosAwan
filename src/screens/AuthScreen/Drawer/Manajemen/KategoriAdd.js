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
import { verifyUserPassword, sendNewCategory, getUserToken } from 'src/utils/authhelper';
import { BottomButton } from 'src/components/Button/ButtonComp';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import MDInput from 'src/components/Input/MDInput';
import { AwanPopup } from 'src/components/ModalContent/Popups';


const height = Dimensions.get('window').height

const KategoriAdd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [categoryName, setCategoryName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const User = useSelector(state => state.User)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)

    const _handleSaveCategory = async () => {
        if (categoryName == "") {
            setAlertMessage("Nama tidak boleh kosong")
            setAlert(true)
        }
        else {
            const userToken = await getUserToken()
            const res = await sendNewCategory({
                id_store: User.store.id_store,
                name_product_category: categoryName
            })
            if (res.status == 201) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getCategory(User.store.id_store, userToken))
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
            <AwanPopup.Alert
                message={alertMessage}
                visible={alert}
                closeAlert={() => setAlert(false)}
            />
            <BarStatus />
            <GlobalHeader
                onPressBack={() => navigation.goBack()}
                title="Tambah Kategori"
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            ><ModalContent
                    image={require('src/assets/images/managemenkategorisuccess.png')}
                    infoText="Tambah Kategori Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <MDInput label="Nama Kategori" value={categoryName}
                        onChangeText={(text) => setCategoryName(text)}
                    />
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Masukkan nama kategori untuk menambah kategori baru</Text>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSaveCategory}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 40 }}
                    buttonTitle="SIMPAN"
                />
            </View>
        </View>
    );
}

export default KategoriAdd

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