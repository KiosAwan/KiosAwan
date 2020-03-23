import React, { useState, useEffect } from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import Container, { Body, Footer } from 'src/components/View/Container'
import { GlobalHeader } from 'src/components/Header/Header'
import { ColorsList } from 'src/styles/colors'
import { Wrapper } from 'src/components/View/Wrapper'
import { Text } from 'src/components/Text/CustomText'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Dropdown } from 'src/components/ModalContent/Popups'
import { Button } from 'src/components/Button/Button'
import { SizeList } from 'src/styles/size'
import Divider from 'src/components/Row/Divider'
import styles from './SubProductStyle'
import MDInput from 'src/components/Input/MDInput'
import { convertRupiah } from 'src/utils/authhelper'
import { getSubProducts, setMarginProduct } from 'src/utils/api/setupharga'

const SubProduct = ({ navigation }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const [productMargin, setProductMargin] = useState([])
    const [products, setProducts] = useState([])
    const [providerSelected, setProviderSelected] = useState()
    const [params, setParams] = useState([])
    const [subProduct, setSubProduct] = useState([])

    const _getSubData = async product => {
        setParams(navigation.state.params)
        const { data, status } = await getSubProducts(product.type)
        if (status == 200) {
            setSubProduct(data)
        }
    }

    const _selectProvider = async provider => {
        setDropdownVisible(false)
        if (provider.code != providerSelected.code) {
            if (productMargin.length > 0) {
                alert('silahkan simpan biaya admin anda terlebih dahulu')
            } else {
                setProviderSelected(provider)
                setProductMargin([])
                const { data, status } = await getSubProducts(params.type, provider.code)
                if (status == 200) {
                    setProducts([])
                    setTimeout(() => setProducts(data), 50)
                }
            }
        }
    }

    const _saveMargin = async () => {
        const { status } = await setMarginProduct(productMargin)
        if (status == 200) {
            alert("Sukses")
            setProductMargin([])
        }
    }
    const _setMargin = (margin, productID, name) => setProductMargin([...productMargin,
    { margin, productID, name }
    ])

    useEffect(() => {
        _getSubData(navigation.state.params)
    }, [])

    return (
        <Container>
            <GlobalHeader title={`Atur Harga ${params.product}`} onPressBack={() => navigation.goBack()} />
            <View style={{ position: 'relative' }}>
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
            <Body>
                {products.map((item, i) => (
                    <Wrapper key={i} style={styles.wrapper} justify="space-between">
                        <View _width="60%" style={styles.leftWrapper}>
                            <Text font="Bold" color="primary" _width="60%">{item.name}</Text>
                            <Text _width="60%">Modal : {convertRupiah(item.price)}</Text>
                        </View>
                        <MDInput onChangeText={txt => _setMargin(txt, item.productID, item.name)}
                            keyboardType='number-pad'
                            _style={styles.rightWrapper} value={item.margin} label="Biaya Admin" />
                    </Wrapper>
                ))}
            </Body>
            <Footer>
                <Button width="100%" onPress={_saveMargin}>SIMPAN</Button>
            </Footer>
        </Container>
    )
}

export default SubProduct
