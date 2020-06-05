import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'

//Styling
import {
    View,
    StyleSheet,
    Dimensions,
    Modal
} from 'react-native';
import BarStatus from 'src/components/BarStatus';
import { GlobalHeader } from 'src/components/Header/Header';
import { ColorsList } from 'src/styles/colors';
import { SizeList } from 'src/styles/size';
import { sendNewCategory, getUserToken } from 'src/utils/authhelper';
import { FontList } from 'src/styles/typography';
import { } from 'src/components/Input/InputComp';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { Input } from 'src/components/Input/MDInput';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Button } from 'src/components/Button/Button';
import { Text } from 'src/components/Text/CustomText';


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
        <Container>
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
            <Body>
                <Input label="Nama Kategori" value={categoryName}
                    onChangeText={(text) => setCategoryName(text)}
                />
                <Text font="SemiBold" style={{ marginTop: SizeList.base }} align="center">Masukkan nama kategori</Text>
            </Body>
            <Footer>
                <Button onPress={_handleSaveCategory}>
                    SIMPAN
                </Button>
            </Footer>
        </Container>
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