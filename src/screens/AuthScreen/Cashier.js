import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList } from 'react-native-gesture-handler';
import { convertRupiah, getUserToken } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { MinusQuantity, AddQuantity, getProduct, removeAllCart } from '../../redux/actions/actionsStoreProduct';
import { CashierHeader } from '../../components/Header/Header';
import { stylesglobe } from '../../styles/globalStyle';
import { RowChild } from '../../components/Helper/RowChild';
import { Icon } from 'native-base';
import { SizeList } from '../../styles/size';
import { FontList } from '../../styles/typography';
import { ProductPlaceholder } from '../../components/LoadingPlaceholder';
import { getCustomer } from '../../redux/actions/actionsCustomer';
import { setFromManajemenProduct } from '../../redux/actions/actionsNewProduct';
import { Text } from 'src/components/Text/CustomText';
import { Image } from 'src/components/CustomImage';
import { Button } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Bottom } from 'src/components/View/Bottom';
import { HOST_IMG_URL } from 'src/config';

const Cashier = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    const User = useSelector(state => state.User)
    const [search, setSearch] = useState('')
    useEffect(() => {
        _loadProduct()
    }, [])

    const _loadProduct = async () => {
        if (Product.data.length == 0) {
            const userToken = await getUserToken()
            dispatch(getProduct(User.store.id_store, userToken))
            // dispatch(removeAllCart())
        }
    }
    return (
        <View style={{ flex: 1 }}>
            <CashierHeader
                clear={() => setSearch('')}
                value={search}
                handleChangeText={(text) => setSearch(text)}
                onPressBack={() => navigation.navigate('/')}
            />
            <Wrapper justify="space-between" style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                <Wrapper _width="85%" justify="space-between">
                    <Button _width="49%" wrapper={{ justify: 'center' }} padding={7} onPress={() => {
                        dispatch(setFromManajemenProduct(null))
                        navigation.navigate('/cashier/new-barcode')
                    }} color="white" >
                        <Image style={{ marginRight: 10, }} size={15} source={require('src/assets/icons/plus-primary.png')} />
                        <Text size={11} color="primary">PRODUK BARU</Text>
                    </Button>
                    <Button _width="49%" padding={7} wrapper={{ justify: 'center' }} onPress={() => navigation.navigate('/cashier/input-manual')} color="white" style={{ paddingLeft: 15, }}>
                        <Image style={{ marginRight: 10, }} size={15} source={require('src/assets/icons/clock.png')} />
                        <Text size={11} color="primary">PESAN MANUAL</Text>
                    </Button>
                </Wrapper>
                <Button _width="10%" padding={7} onPress={() => navigation.navigate('/cashier/add-cart-with-barcode')}>
                    <Image size={18} source={require('src/assets/icons/barcode.png')} />
                </Button>
            </Wrapper>
            <View style={[styles.childContainer, { backgroundColor: Product.isLoading ? "white" : ColorsList.authBackground, justifyContent: Product.data.length == 0 ? 'center' : null, alignItems: Product.data.length == 0 ? 'center' : null }]}>
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
                            <Image style={{ width: 200, height: 200 }} source={require('../../assets/images/noproductlist.png')} />
                            <Text style={{ textAlign: "center", ...FontList.subtitleFontGreyBold }}>Anda belum mempunyai produk</Text>
                        </View>
                        :
                        <FlatList
                            style={Product.jumlahitem > 0 ? { marginBottom: 50 } : null}
                            data={Product.data.filter(item => item.name_product.toLowerCase().includes(search.toLowerCase()))}
                            renderItem={({ item }) => (
                                <ProductCard
                                    productImage={item.photo_product !== "" ? `${HOST_IMG_URL}/${item.photo_product}` : null}
                                    name={item.name_product.toUpperCase()}
                                    price={convertRupiah(item.price_out_product)}
                                    onPressMinus={() => dispatch(MinusQuantity(item))}
                                    onPressPlus={() => dispatch(AddQuantity(item))}
                                    plusDisabled={item.manage_stock == 1 ? item.stock == 0 ? true : (item.quantity ? item.quantity < item.stock ? false : true : false) : false}
                                    quantity={item.quantity ? item.quantity : null}
                                    manage_stock={item.manage_stock == 1 ? true : false}
                                    stock={item.manage_stock == 1 ? item.stock : null}
                                    min_stock={item.manage_stock ? item.notif == 1 ? item.min_stock : null : null}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => index.toString()}
                        />
                }
            </View>
            {
                Product.jumlahitem > 0 ?
                    <Bottom>
                        <Button onPress={async () => {
                            navigation.navigate('/cashier/cart')
                        }} width="100%">
                            <Wrapper>
                                <Icon style={{ color: ColorsList.whiteColor, marginRight: 10 }} name="ios-cart" />
                                <Text style={styles.btnTextBelanja}>BELANJA {Product.jumlahitem} PRODUK</Text>
                            </Wrapper>
                            <View style={{ backgroundColor: ColorsList.primarySoft, height: '100%', width: 2 }} />
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ ...FontList.titleFont, color: 'white' }}>{convertRupiah(Product.total)}</Text>
                            </View>
                        </Button>
                    </Bottom>
                    :
                    null
            }
        </View>
    )
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