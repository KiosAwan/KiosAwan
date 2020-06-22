import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { View, Modal, TextInput } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { editCategory, deleteCategory, getUserToken } from 'src/utils/authhelper';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import { Input } from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';
import { SizeList } from 'src/styles/size';


const KategoriEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [form, setForm] = stateObject(navigation.state.params.item)
    const [modalVisible, setModalVisible] = useState(false)
    const [alertDel, setAlertDel] = useState(false)
    const User = useSelector(state => state.User)
    //alert
    const [alert, setAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState(false)


    const _handleSaveCategory = async () => {
        if (form.name_product_category == "") {
            setAlertMessage("Nama tidak boleh kosong")
            setAlert(true)
        } else {
            const userToken = await getUserToken()
            const res = await editCategory({
                name_product_category: form.name_product_category
            }, form.id_product_category)
            if (res.status == 200) {
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

    const _handleDeleteCategory = async () => {
        setAlertDel(false)
        await deleteCategory(form.id_product_category)
        const userToken = await getUserToken()
        setModalVisible(true)
        setTimeout(() => {
            navigation.goBack()
            dispatch(getCategory(User.store.id_store, userToken))
            setModalVisible(false)
        }, 1000)
    }
    return <Container header={{
        onPressBack: () => navigation.goBack(),
        handleDeleteCategory: () => setAlertDel(true),
        title: "Edit Kategori",
        image: require('src/assets/icons/trash-primary.png'),
    }}>
        <AwanPopup.Alert
            message={alertMessage}
            visible={alert}
            closeAlert={() => setAlert(false)}
        />
        <AwanPopup.Title title="Hapus Kategori" visible={alertDel} message={`Kategori ${form.name_product_category} akan dihapus dari daftar kategorimu.`}>
            <View></View>
            <Button onPress={() => setAlertDel(false)} style={{ width: '25%' }} color="link">Batal</Button>
            <Button onPress={_handleDeleteCategory} style={{ width: '25%' }}>Ya</Button>
        </AwanPopup.Title>
        <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}>
            <ModalContent
                image={require('src/assets/images/managemenkategorisuccess.png')}
                infoText="Edit Kategori Berhasil!"
                closeModal={() => setModalVisible(false)}
            />
        </Modal>
        <Body>
            <Input label="Nama Kategori" value={form.name_product_category}
                onChangeText={name_product_category => setForm({ name_product_category })}
            />
            <Text style={{ marginTop: SizeList.base }} align="center">Masukkan nama kategori baru</Text>
        </Body>
        <Footer>
            <Button onPress={_handleSaveCategory}>SIMPAN</Button>
        </Footer>
    </Container>
}

export default KategoriEdit

