import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { convertRupiah, getUserToken } from '../../utils/authhelper';
import { ColorsList } from '../../styles/colors';
import { ProductCard } from '../../components/Card/CardComp';
import { MinusQuantity, AddQuantity, getProduct, removeAllCart } from '../../redux/actions/actionsStoreProduct';
import { CashierHeader, GlobalHeader, IconHeader, SearchHeader } from '../../components/Header/Header';
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
import { Button, ButtonShadow } from 'src/components/Button/Button';
import { Wrapper } from 'src/components/View/Wrapper';
import { Bottom } from 'src/components/View/Bottom';
import { HOST_IMG_URL } from 'src/config';
import Container, { BodyFlatList } from 'src/components/View/Container';
import { TextInput } from 'src/components/Input/MDInput';
import ButtonCart from 'src/components/View/ButtonCart';

const Cashier = ({ navigation }) => {
    const dispatch = useDispatch()
    const Product = useSelector(state => state.Product)
    const User = useSelector(state => state.User)
    const [search, setSearch] = useState('')
    const { data, belanja, ppob_cart, isLoading } = Product
    useEffect(() => {
        _loadProduct()
    }, [])

    const _loadProduct = async () => {
        if (data.length == 0) {
            const userToken = await getUserToken()
            dispatch(getProduct(User.store.id_store, userToken))
        }
    }

    return <Container style={{ marginBottom: SizeList.base }}>
        <SearchHeader
            onPressBack={() => navigation.goBack()}
            onChangeText={txt => setSearch(txt)}
            onPressIcon={() => setSearch('')}
            search={search}
            label="CARI PRODUK BARANG"
            title="PRODUK BARANG"
        />
        <Wrapper justify="space-between" style={{ paddingHorizontal: SizeList.bodyPadding }}>
            <Wrapper _flex flexContent>
                <ButtonShadow
                    onPress={() => {
                        dispatch(setFromManajemenProduct(null))
                        navigation.navigate('/cashier/new-barcode')
                    }}
                    style={{ marginRight: SizeList.base }}>
                    <Image size={15} source={require('src/assets/icons/plus-primary.png')} />
                    <Text size={11} color="primary">PRODUK BARU</Text>
                </ButtonShadow>
                <ButtonShadow
                    onPress={() => navigation.navigate('/cashier/input-manual')}
                    style={{ marginRight: SizeList.base }}>
                    <Image size={15} source={require('src/assets/icons/clock.png')} />
                    <Text size={11} color="primary">PESAN MANUAL</Text>
                </ButtonShadow>
            </Wrapper>
            <Button padding={7} onPress={() => navigation.navigate('/cashier/add-cart-with-barcode')}>
                <Image size={18} source={require('src/assets/icons/barcode.png')} />
            </Button>
        </Wrapper>
        {isLoading ?
            <View>
                <ProductPlaceholder />
                <ProductPlaceholder />
                <ProductPlaceholder />
                <ProductPlaceholder />
                <ProductPlaceholder />
            </View>
            :
            data.length > 0 ?
                <BodyFlatList
                    style={Product.jumlahitem > 0 ? { marginBottom: 50 } : null}
                    data={data.filter(item => item.name_product.toLowerCase().includes(search.toLowerCase()))}
                    renderItem={({ item }) => {
                        const { stock,
                            quantity,
                            price_out_product,
                            photo_product,
                            notif,
                            name_product,
                            min_stock,
                            manage_stock
                        } = item
                        return <ProductCard
                            productImage={photo_product !== "" ? `${HOST_IMG_URL}/${photo_product}` : null}
                            name={name_product.toUpperCase()}
                            price={convertRupiah(price_out_product)}
                            onPressMinus={() => dispatch(MinusQuantity(item))}
                            onPressPlus={() => dispatch(AddQuantity(item))}
                            plusDisabled={manage_stock == 1 ? stock == 0 ? true : (quantity ? quantity < stock ? false : true : false) : false}
                            quantity={quantity ? quantity : null}
                            manage_stock={manage_stock == 1 ? true : false}
                            stock={manage_stock == 1 ? stock : null}
                            min_stock={manage_stock ? notif == 1 ? min_stock : null : null}
                        />
                    }}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                />
                :
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginBottom: 70 }}>
                    <Image style={{ width: 150, height: 150 }} source={require('../../assets/images/noproductlist.png')} />
                    <Text align="center">Anda belum memiliki produk, tambahkan</Text>
                    <Text align="center"> produk baru menggunakan tombol diatas</Text>
                </View>
        }
        {Product.jumlahitem > 0 &&
            <View style={{ marginHorizontal: 10 }}>
                <ButtonCart quantity={Product.jumlahitem} price={Product.total.convertRupiah()} onPress={() => {
                    parseInt(Product.jumlahitem) > 0 && navigation.navigate('/cashier/cart')
                }} />
            </View>
        }
    </Container>
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