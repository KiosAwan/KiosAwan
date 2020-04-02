import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import { View, Modal, TextInput } from 'react-native';
import { ColorsList } from 'src/styles/colors';
import { editCategory, deleteCategory } from 'src/utils/authhelper';
import ModalContent from 'src/components/ModalContent/ModalContent';
import { getCategory } from 'src/redux/actions/actionsStoreCategory';
import { AwanPopup } from 'src/components/ModalContent/Popups';
import { Button } from 'src/components/Button/Button';
import MDInput from 'src/components/Input/MDInput';
import { stateObject } from 'src/utils/state';
import Container, { Body, Footer } from 'src/components/View/Container';
import { Text } from 'src/components/Text/CustomText';


const KategoriEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [form, setForm] = stateObject(navigation.state.params.item)
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState(false)
    const User = useSelector(state => state.User)

    const _handleSaveCategory = async () => {
        console.debug(form)
        if (form.name_product_category == "") {
            alert("Nama tidak boleh kosong")
        } else {
            const res = await editCategory({
                name_product_category: form.name_product_category
            }, form.id_product_category)
            if (res.status == 200) {
                setModalVisible(true)
                setTimeout(() => {
                    navigation.goBack()
                    dispatch(getCategory(User.store.id_store))
                    setModalVisible(false)
                }, 1000)
            } else if (res.status == 400) {
                alert(res.data.errors.msg)
            }
        }
    }

    const _handleDeleteCategory = async () => {
        setAlert(false)
        await deleteCategory(form.id_product_category)
        setModalVisible(true)
        setTimeout(() => {
            navigation.goBack()
            dispatch(getCategory(User.store.id_store))
            setModalVisible(false)
        }, 1000)
    }
    return <Container header={{
        onPressBack: () => navigation.goBack(),
        handleDeleteCategory: () => setAlert(true),
        title: "Edit Kategori",
        image: require('src/assets/icons/trash.png'),
    }}>
        <AwanPopup.Title title="Hapus Kategori" visible={alert} message={`Kategori ${form.name_product_category} akan dihapus dari daftar kategorimu.`}>
            <View></View>
            <Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
            <Button onPress={_handleDeleteCategory} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
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
            <View style={{ borderRadius: 5, backgroundColor: ColorsList.whiteColor, padding: 15, marginBottom: 15 }}>
                <MDInput label="Nama Kategori" value={form.name_product_category}
                    onChangeText={name_product_category => setForm({ name_product_category })}
                />
            </View>
            <Text align="center" font="ExtraBold">Masukkan nama kategori baru</Text>
        </Body>
        <Footer>
            <Button onPress={_handleSaveCategory}>SIMPAN</Button>
        </Footer>
    </Container>
}

export default KategoriEdit

