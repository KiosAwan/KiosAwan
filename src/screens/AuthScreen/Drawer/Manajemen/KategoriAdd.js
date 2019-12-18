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
import { verifyUserPassword, sendNewCategory } from '../../../../utils/authhelper';
import { BottomButton } from '../../../../components/Button/ButtonComp';
import { FontList } from '../../../../styles/typography';
import { FloatingInput } from '../../../../components/Input/InputComp';
import ModalContent from '../../../../components/ModalContent/ModalContent';
import { getCategory } from '../../../../redux/actions/actionsStoreCategory';


const height = Dimensions.get('window').height

const KategoriAdd = ({ navigation }) => {
    const dispatch = useDispatch()
    const [categoryName, setCategoryName] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const User = useSelector(state => state.User)

    const _handleSaveCategory = async () => {
        if (categoryName == "") {
            alert("Nama tidak boleh kosong")
        }
        else {
            const res = await sendNewCategory({
                id_store: User.store.id_store,
                name_product_category: categoryName
            })
            if (res.status == 201) {
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
    return (
        <View style={styles.container} >
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
                    image={require('../../../../assets/images/managemenkategorisuccess.png')}
                    infoText="Tambah Kategori Berhasil!"
                    closeModal={() => setModalVisible(false)}
                />
            </Modal>
            <View style={{ alignItems: "center" }}>
                <View style={{marginTop : 20, padding: 20, width: SizeList.width - 60, backgroundColor: 'white', borderRadius: 5 }}>
                    <FloatingInput label="Nama Kategori">
                        <TextInput value={categoryName}
                            onChangeText={(text) => setCategoryName(text)}
                        />
                    </FloatingInput>
                </View>
                <View style={{ width: '90%', padding: 10 }}>
                    <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold, fontSize: 14 }}>Masukkan nama kategori untuk menambah kategori baru</Text>
                </View>
            </View>
            <View style={{ alignSelf: "center", position: 'absolute', bottom: 10, }}>
                <BottomButton
                    onPressBtn={_handleSaveCategory}
                    style={{ backgroundColor: ColorsList.primaryColor, width: SizeList.width - 20 }}
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