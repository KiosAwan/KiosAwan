import React, {useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker'
import {useSelector, useDispatch} from 'react-redux'
import { InputWithLabel } from '../../components/Input/InputComp';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { getCategory } from '../../redux/actions/actionsStoreCategory';
import { addProductName, addProductImage } from '../../redux/actions/actionsNewProduct';

const NewProductName = ({navigation}) => {
    const dispatch = useDispatch()
    const NewProduct = useSelector(state => state.NewProduct)
    const User = useSelector(state => state.User)

    const [isDisabled , setDisabled] = useState(true)
    useEffect(() => { 
        _checkName()
    }, [])

    const _checkName = () => {
        if(NewProduct.name == ''){
            setDisabled(false)
        }
    }

    const _handlePressNext = async () => {
        await dispatch(getCategory(User.store.id_store))
        navigation.navigate('NewProductLast')
    }

    const _handleChoosePhoto = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 300,
            cropping: true
          }).then(image=> {
            dispatch(addProductImage(image.path))
            });
        };
        return (
            <View>
                <RegisterButton 
                buttonTitle="Add Photo"
                onPressBtn={_handleChoosePhoto}
                />
                <InputWithLabel
                disabled
                label="Barcode number"
                value={NewProduct.barcode}
                />
                <InputWithLabel
                disabled={isDisabled}
                label="Product Name"
                value={NewProduct.name}
                handleChangeText={(text) => dispatch(addProductName(text))}
                />
                <RegisterButton
                onPressBtn={_handlePressNext}
                buttonTitle="Complete Product"
                />
            </View>
        );
    }

export default NewProductName