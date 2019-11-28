import React from 'react';
import { View, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { AddCart, MinusQuantity, AddQuantity } from '../../redux/actions/actionsStoreProduct';
import { RegisterButton } from '../../components/Button/ButtonComp';
import { getCustomer } from '../../redux/actions/actionsCustomer';

const Cart = ({navigation}) =>  {
    const dispatch = useDispatch()
    const Product  = useSelector(state => state.Product)
    const User = useSelector(state => state.User)
    const _handleNextBtn = async () => {
        await dispatch(getCustomer(User.store.id_store))
        navigation.navigate('CheckOut')
    }
        return (
            <View style={{flex : 1, backgroundColor : ColorsList.authBackground, padding : 20}}>
                <Text>Cart</Text>
                <Text>Total belanja : {Product.total}</Text>
                <Text>Total item : {Product.jumlahitem}</Text>
                {
                    Product.belanja.length > 0 ?
                <FlatList
                data={Product.belanja}
                renderItem={({ item }) => (
                    <ProductCard
                    name={item.name_product}
                    price={convertRupiah(item.price_out_product)}
                    onPressAdd={() => dispatch(AddCart(item))}
                    onPressMinus={() => dispatch(MinusQuantity(item))}
                    onPressPlus={() => dispatch(AddQuantity(item))}
                    quantity={item.quantity ? item.quantity : null}
                    />
                )}
                keyExtractor={(item, index) => index.toString()}
                /> : 
                <Text>Anda belum mempunyai barang di keranjang</Text>
                }
                <RegisterButton
                buttonTitle="Lanjut ke pembayaran"
                onPressBtn={_handleNextBtn}
                disabled={Product.belanja.length > 0 ? false : true}
                />
                
            </View>
        );
    }

export default Cart