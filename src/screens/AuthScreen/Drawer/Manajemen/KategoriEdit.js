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
import {  GlobalHeaderWithIcon } from '../../../../components/Header/Header';
import { ColorsList } from '../../../../styles/colors';
import { SizeList } from '../../../../styles/size';
import { editCategory, deleteCategory } from '../../../../utils/authhelper';
import { BottomButton, Button } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';
import { AwanPopup } from '../../../../components/ModalContent/Popups';


const KategoriEdit = ({ navigation }) => {
    const dispatch = useDispatch()
    const [categoryName, setCategoryName] = useState()
    const [categoryId, setIdCategory] = useState()
    const [modalVisible, setModalVisible] = useState(false)
    const [alert, setAlert] = useState(false)
    const User = useSelector(state => state.User)

    useEffect(() => {
        _getParams()
    }, [])
    const _getParams = async () => {
        const { item } = navigation.state.params
        setCategoryName(item.name_product_category)
        setIdCategory(item.id_product_category)
    }

    const _handleSaveCategory = async () => {
        if (categoryName == "") {
            alert("Nama tidak boleh kosong")
        }
        else {
            const res = await editCategory({
                name_product_category: categoryName
            }, categoryId)
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
        await deleteCategory(categoryId)
        setModalVisible(true)
        setTimeout(() => {
            navigation.goBack()
            dispatch(getCategory(User.store.id_store))
            setModalVisible(false)
        }, 1000)
    }
    return (
        <View style={styles.container} >
            <BarStatus />
            <AwanPopup.Title title="Hapus Kategori" visible={alert} message={`Kategori ${categoryName} akan dihapus dari daftar kategorimu.`}>
                <View></View>
                <Button onPress={() => setAlert(false)} style={{ width: '25%' }} color="link" textProps={{ size: 15, font: 'Bold' }}>Batal</Button>
                <Button onPress={_handleDeleteCategory} style={{ width: '25%' }} textProps={{ size: 15, font: 'Bold' }}>Ya</Button>
            </AwanPopup.Title>
            <GlobalHeaderWithIcon
                onPressBack={() => navigation.goBack()}
                title="Edit Kategori"
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
                    image={require('../../../../assets/images/managemenkategorisuccess.png')}
                    infoText="Edit Kategori Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{ marginTop: 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Nama Kategori">
                        <TextInput value={categoryName}
                            onChangeText={(text) => setCategoryName(text)}
                        />
                    </FloatingInput>
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Masukkan nama kategori baru</Text>
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

export default KategoriEdit

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