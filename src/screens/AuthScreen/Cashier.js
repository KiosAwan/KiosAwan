import React from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { RegisterButton } from '../../components/Button/ButtonComp';
import { FlatList } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { AddCart, MinusQuantity, AddQuantity, AddCartByBarcode } from '../../redux/actions/actionsStoreProduct';

const Cashier = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    return (
        <View style={{ flex: 1, backgroundColor: ColorsList.authBackground, padding: 20 }}>
            <Text>Cashier</Text>
            <RegisterButton
                buttonTitle="Ada Barcode"
                onPressBtn={() => navigation.navigate('NewBarcode')}
            />
            <RegisterButton
                buttonTitle="Tambah dengan barcode"
                // onPressBtn={() => dispatch(AddCartByBarcode(9992694242151915))}
            />
            <RegisterButton
                buttonTitle="Input Manual"
                onPressBtn={() => navigation.navigate('InputManual')}
            />
            <RegisterButton
                buttonTitle="Check Out"
                onPressBtn={() => navigation.navigate('Cart')}
            />
            <Text>{Product.total}</Text>
            <FlatList
                data={Product.data}
                renderItem={({ item }) => (
                    <ProductCard
                        name={item.name_product}
                        price={convertRupiah(item.price_out_product)}
                        onPressAdd={() => dispatch(AddCart(item))}
                        onPressMinus={() => dispatch(MinusQuantity(item))}
                        onPressPlus={() => dispatch(AddQuantity(item))}
                        plusDisabled={item.manage_stock == 1 ? item.quantity < item.stock ? false : true : false}
                        quantity={item.quantity ? item.quantity : null}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
}

export default Cashier