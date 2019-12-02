import React, { useState } from 'react'
import {
    View,
    Text
} from 'react-native'
import { useDispatch } from 'react-redux'
import { InputWithLabel } from '../../components/Input/InputComp'
import { RegisterButton } from '../../components/Button/ButtonComp'
import { RowChild } from '../../components/Helper/RowChild'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { getRandomNegativeNum } from '../../utils/authhelper'
import { AddCart } from '../../redux/actions/actionsStoreProduct'
const InputManual = ({ navigation }) => {
    const dispatch = useDispatch()
    const [name_product, setName] = useState()
    const [price_in_product, setPriceIn] = useState()
    const [price_out_product, setPriceOut] = useState()
    const [quantity, setQuantity] = useState(0)

    const _handlePressBtn = () => {
        const manualProduct = {
            name_product,
            price_in_product,
            price_out_product,
            quantity,
            id_product: getRandomNegativeNum()
        }
        dispatch(AddCart(manualProduct))
        navigation.goBack()
    }

    const _handleMinusQuantity = () => {
        if (quantity > 0) {
            let a = parseInt(quantity) - 1
            setQuantity(a)
        }
    }
    const _handlePlusQuantity = () => {
        let a = parseInt(quantity) + 1
        setQuantity(a)
    }
    return (
        <View>
            <Text>Input manual</Text>
            <InputWithLabel
                label="Nama Barang"
                value={name_product}
                handleChangeText={(text) => setName(text)}
            />
            <InputWithLabel
                label="Harga Beli"
                value={price_in_product}
                keyboardType="numeric"
                handleChangeText={(text) => setPriceIn(text)}
            />
            <InputWithLabel
                label="Harga Jual"
                value={price_out_product}
                keyboardType="numeric"
                handleChangeText={(text) => setPriceOut(text)}
            />
            <View style={{ ...RowChild }}>
                <View style={{ width: 200 }}>
                    <InputWithLabel
                        label="Jumlah"
                        value={quantity.toString()}
                        keyboardType="numeric"
                        handleChangeText={(text) => setQuantity(text)}
                    />
                </View>
                <Icon name="minus-circle" size={30} onPress={_handleMinusQuantity} />
                <Icon name="plus-circle" size={30} onPress={_handlePlusQuantity} />
            </View>
            <RegisterButton
                buttonTitle="Simpan"
                onPressBtn={_handlePressBtn}
            />
        </View>
    )
}

export default InputManual