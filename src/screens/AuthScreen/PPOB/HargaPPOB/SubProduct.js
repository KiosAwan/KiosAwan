import styles from './SubProductStyle'
import React, { useState, useEffect } from 'react'
import MDInput from 'src/components/Input/MDInput'
import Divider from 'src/components/Row/Divider'
import Container, { BodyFlatList, Footer, Body } from 'src/components/View/Container'
import { Wrapper } from 'src/components/View/Wrapper'
import { View, Image } from 'react-native'
import { Text } from 'src/components/Text/CustomText'
import { stateArray, stateObject } from 'src/utils/state'
import { SizeList } from 'src/styles/size'
import { GlobalHeader } from 'src/components/Header/Header'
import { getSubProducts, setMarginProduct } from 'src/utils/api/setupharga'
import { Dropdown } from 'src/components/ModalContent/Popups'
import { convertRupiah } from 'src/utils/authhelper'
import { ColorsList } from 'src/styles/colors'
import { Button } from 'src/components/Button/Button'
import { $Border } from 'src/utils/stylehelper'
import Alert from 'src/utils/alert'

const SubProduct = ({ navigation }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [products, setProducts] = useState([])
    const [providerSelected, setProviderSelected] = useState()
    const [subProduct, setSubProduct] = useState([])
    const [product] = useState(navigation.state.params)
    const [productMargin, setProductMargin, resetProductMargin] = stateObject()
    const _getSubData = async () => {
        const { data, status } = await getSubProducts(product.type)
        if (status == 200) {
            setSubProduct(data)
            if (data.length == 1)
                _selectProvider(data[0])
        }
    }

    const _selectProvider = async (provider, force) => {
        setDropdownVisible(false)
        if (force || (provider.code != (providerSelected ? providerSelected.code : null))) {
            if (!force && Object.keys(productMargin).length > 0) {
                alert('silahkan simpan biaya admin anda terlebih dahulu')
            } else {
                setProviderSelected(provider)
                resetProductMargin()
                const { data, status } = await getSubProducts(product.type, provider.code)
                if (status == 200) {
                    setProducts([])
                    setTimeout(() => setProducts(data), 50)
                }
            }
        }
    }
    const _saveMargin = async () => {
        let { type } = product
        let finalMargins = Object.keys(productMargin).map(i => {
            let { margin, price, productID, product } = productMargin[i] || {}
            if (product.product_type == 3) {
                margin = margin - price
            }
            if (!productID) {
                return {}
            }
            return { productID, product, margin, type }
        })
        const { status } = await setMarginProduct(finalMargins)
        if (status == 200) {
            alert("Sukses")
            resetProductMargin()
            _selectProvider(providerSelected, true)
        }
    }

    const renderList = () => {
        if (product.product_type == 1) {
            return renderProductType1()
        }
        if (product.product_type == 2) {
            return renderProductType2()
        }
        if (product.product_type == 3) {
            return renderProductType3()
        }
    }
    const renderProductType1 = () => {
        const show = item => {
            try {
                let key = item.productID + item.name
                let data = productMargin[key]
                return data.openCashback
            } catch (err) {
                return false
            }
        }
        const _openCashback = item => {
            let key = item.productID + item.name
            let data = productMargin[key]
            data = { ...data, openCashback: true }
            setProductMargin({ [key]: data })
        }

        const _pilihCashback = (item, margin) => {
            let { name, productID } = item
            let key = productID + name
            let data = productMargin[key]
            data = {
                ...data,
                margin, productID, product: name,
                openCashback: false
            }
            setProductMargin({ [key]: data })
        }

        const renderMap = (item, i) => {
            let key = item.productID + item.name
            const renderCashback = () => {
                let [modal, harga] = [
                    item.awan + parseInt(item.price),
                    // 23000
                    parseInt(item.price) + (
                        productMargin[key] ?
                            productMargin[key].margin ?
                                productMargin[key].margin :
                                parseInt(item.margin) :
                            parseInt(item.margin)
                    )
                ]
                return harga - modal > 0 ? harga - modal : 0
            }
            return <View>
                <Wrapper key={i.toString()} radius spaceBetween style={{ marginVertical: 5, backgroundColor: ColorsList.white }}>
                    <View _width="60%" style={{ padding: 10 }}>
                        <Text color="primary">{item.name}</Text>
                        <Text>Admin: {convertRupiah(productMargin[key] && productMargin[key].margin || item.margin)}</Text>
                    </View>
                    {show(item) ?
                        <View _width="35%" style={{ ...$Border(ColorsList.greyAuthHard, 0, 0, 0, 1), backgroundColor: ColorsList.authBackground, padding: 10, justifyContent: 'flex-start' }}>
                            <Text color="primary" >Cashback</Text>
                            <Text>{convertRupiah(renderCashback())}</Text>
                            <Divider color={ColorsList.primary} />
                        </View> :
                        <View _justify="flex-end">
                            <Button color="linkPrimary" onPress={() => _openCashback(item)}>Pilih Biaya Admin</Button>
                        </View>
                    }
                </Wrapper>
                {
                    show(item) && <View>
                        <Text align="center">Pilih Biaya Admin</Text>
                        <Wrapper flexContent style={{ marginVertical: 10 }}>
                            {
                                [2000, 2500, 3000, 3500].map((btn, i) => {
                                    return <Button
                                        active={productMargin[key] && productMargin[key].margin == btn || !productMargin[key].margin && btn == item.margin}
                                        style={{ margin: 5 }}
                                        onPress={() => _pilihCashback(item, btn)}
                                        color={['white', 'primary']}
                                        activeColor="white"
                                        children={convertRupiah(btn)}
                                    />
                                })
                            }
                        </Wrapper>
                        <Button style={{ marginBottom: 10 }} disabled color="info">{`Cashback yang di dapat oleh mitra sebesar ${convertRupiah(renderCashback())}`}</Button>
                    </View>
                }
            </View>
        }

        return <View style={{ flex: 1, paddingTop: 10 }}>
            <View style={{ width: "80%", alignItems: "center", alignSelf: "center" }}>
                <Text align="center">Jumlah cashback menyesuaikan biaya admin yang dipilih</Text>
            </View>
            {products.map(renderMap)}
        </View>
    }

    const renderProductType2 = () => {
        return null
    }
    const renderProductType3 = () => products.map((item, i) => {
        let { price, productID, name, margin } = item
        let _key = `${productID}${name}`
        let value = () => {
            return productMargin[_key] &&
                productMargin[_key].margin ||
                (parseInt(margin) + parseInt(price)).toString()
        }
        return <Wrapper key={i.toString()} style={styles.wrapper} justify="space-between">
            <View _width="60%" style={styles.leftWrapper}>
                <Text font="Bold" color="primary" _width="60%">{name}</Text>
                <Text _width="60%">Modal : {convertRupiah(price)}</Text>
            </View>
            <MDInput
                onChangeText={margin => setProductMargin({
                    [_key]: { margin, productID, product: name, price }
                })}
                onBlur={() => {
                    if (!(productMargin[_key] && parseInt(productMargin[_key].margin) > parseInt(price))) {
                        Alert('Perhatian', 'Harga Jual Harus Lebih Besar Dari Harga Modal')
                        setProductMargin({
                            [_key]: null
                        })
                    }
                }}
                keyboardType='number-pad'
                _style={styles.rightWrapper} value={value()} label="Harga Jual" />
        </Wrapper>
    })

    const render = () => <View style={{ flex: 1 }}>
        {
            ['pulsa', 'kuota'].includes(product.type) && <View style={{ position: 'relative' }}>
                <Dropdown selected={!providerSelected ? 'Pilih layanan seluler' : providerSelected.operator} visible={dropdownVisible} state={setDropdownVisible} style={[styles.dropdownContentStyle]}>
                    {
                        subProduct.map((item, i) => [
                            <Button key={i} width={SizeList.width} onPress={() => _selectProvider(item)} wrapper={{ justify: 'flex-start', }} key={i} color="link">
                                <Image style={{ width: 20, height: 20 }} _style={{ marginRight: 10 }} source={{ uri: item.image }} />
                                <Text>{item.operator}</Text>
                            </Button>,
                            i < subProduct.length - 1 && <Divider />
                        ])
                    }
                </Dropdown>
            </View>
        }
        <Body>
            {renderList()}
        </Body>
        <Footer>
            <Button width="100%" onPress={_saveMargin}>SIMPAN</Button>
        </Footer>
    </View>

    useEffect(() => {
        _getSubData()
    }, [])

    return <Container>
        <GlobalHeader title={`Atur Harga ${product.product}`} onPressBack={() => navigation.goBack()} />
        {render()}
    </Container>
}

export default SubProduct