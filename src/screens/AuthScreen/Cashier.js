import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { ButtonWithIcon, BottomButton } from '../../components/Button/ButtonComp';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { convertRupiah } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { MinusQuantity, AddQuantity, AddCartByBarcode, getProduct, removeAllCart } from '../../redux/actions/actionsStoreProduct';
import { CashierHeader, GlobalHeader } from '../../components/Header/Header';
import { stylesglobe } from '../../styles/globalStyle';
import { RowChild } from '../../components/Helper/RowChild';
import { Icon } from 'native-base';
import { SizeList } from '../../styles/size';
import { FontList } from '../../styles/typography';
import { ProductPlaceholder } from '../../components/LoadingPlaceholder';
import { getCustomer } from '../../redux/actions/actionsCustomer';

const Cashier = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    const User = useSelector(state => state.User)
    const [search, setSearch] = useState('')
    useEffect(() => {
        _loadProduct()
    }, [])

    const _loadProduct = () => {
        dispatch(getProduct(User.store.id_store))
        dispatch(removeAllCart())
    }
    return (
        <View style={{ flex: 1 }}>
            <CashierHeader
                handleChangeText={(text) => setSearch(text)}
                onPressBack={() => navigation.navigate('/')}
            />
            <View style={styles.wrapButtonHeader}>
                <ButtonWithIcon
                    onPressBtn={() => navigation.navigate('/cashier/new-barcode')}
                    style={styles.btnIconStyle}
                    iconName="plus"
                    buttonTitle="PRODUK BARU"
                />
                <ButtonWithIcon
                    style={styles.btnIconStyle}
                    onPressBtn={() => navigation.navigate('/cashier/input-manual')}
                    iconName="history"
                    buttonTitle="PESAN MANUAL"
                />
                <TouchableOpacity onPress={() => navigation.navigate('/cashier/add-cart-with-barcode')}>
                    <View style={styles.barcodeButton}>
                        <Icon name="ios-barcode" style={{ color: 'white' }} />
                    </View>
                </TouchableOpacity>
            </View>
            <View style={[styles.childContainer, { backgroundColor: Product.isLoading ? "white" : ColorsList.authBackground ,justifyContent : Product.data.length == 0 ? 'center' : null, alignItems : Product.data.length == 0 ? 'center' : null}]}>
                {Product.isLoading ?
                    <View>
                        <ProductPlaceholder />
                        <ProductPlaceholder />
                        <ProductPlaceholder />
                        <ProductPlaceholder />
                        <ProductPlaceholder />
                    </View>
                    :
                    Product.data.length == 0 ?
                        <View>
                            <Image style={{width : 200, height : 200}} source={require('../../assets/images/noproductlist.png')}/>
                            <Text style={{textAlign : "center", ...FontList.subtitleFontGreyBold}}>Anda belum mempunyai produk</Text>
                        </View>
                        :
                        <FlatList
                            data={Product.data.filter(item => item.name_product.toLowerCase().includes(search))}
                            renderItem={({ item }) => (
                                <ProductCard
                                    name={item.name_product}
                                    price={convertRupiah(item.price_out_product)}
                                    onPressMinus={() => dispatch(MinusQuantity(item))}
                                    onPressPlus={() => dispatch(AddQuantity(item))}
                                    plusDisabled={item.manage_stock == 1 ? (item.quantity ? item.quantity < item.stock ? false : true : false) : false}
                                    quantity={item.quantity ? item.quantity : null}
                                    stock={item.manage_stock == 1 ? item.stock : null}
                                />

                            )}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                }
            </View>
            {
                Product.jumlahitem > 0 ?
                    <View style={stylesglobe.absoluteBottom}>
                        <BottomButton
                            onPressBtn={() => {
                                navigation.navigate('/cashier/cart')
                                dispatch(getCustomer(User.store.id_store))
                            }}
                            style={styles.absoluteButton}
                            content={
                                <View style={{ flexDirection: 'row', width: SizeList.width - 30, justifyContent: 'space-around' }}>
                                    <View style={{ ...RowChild }}>
                                        <Icon name="ios-cart" />
                                        <Text style={styles.btnTextBelanja}>BELANJA {Product.jumlahitem} PRODUK</Text>
                                    </View>
                                    <View style={{ backgroundColor: '#f233ac', width: 2 }} />
                                    <View style={{ justifyContent: 'center' }}>
                                        <Text style={{ ...FontList.titleFont, color: 'white' }}>{convertRupiah(Product.total)}</Text>
                                    </View>
                                </View>
                            }
                        />
                    </View>
                    : null
            }
        </View>
    );
}

export default Cashier

const styles = StyleSheet.create({
    childContainer: {
        flex: 1,
        backgroundColor: ColorsList.authBackground,
        padding: 15,
    },
    btnIconStyle: {
        backgroundColor: 'white',
        borderColor: ColorsList.primaryColor,
        borderWidth: 1,
        paddingHorizontal: 15
    },
    wrapButtonHeader: {
        ...stylesglobe.topBarHeight,
        ...RowChild,
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    barcodeButton: {
        backgroundColor: ColorsList.primaryColor,
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20
    },
    absoluteButton: {
        justifyContent: 'space-between',
        backgroundColor: ColorsList.primaryColor,
        width: SizeList.width - 30
    },
    btnTextBelanja: {
        ...FontList.titleFont,
        color: 'white'
    }
})