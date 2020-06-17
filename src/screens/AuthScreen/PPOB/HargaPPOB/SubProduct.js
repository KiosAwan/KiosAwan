import styles from './SubProductStyle'
import React, { useState, useEffect } from 'react'
import MDInput, { Input } from 'src/components/Input/MDInput'
import Divider from 'src/components/Row/Divider'
import Container, { Footer, Body } from 'src/components/View/Container'
import { Wrapper } from 'src/components/View/Wrapper'
import { View, Image } from 'react-native'
import { Text } from 'src/components/Text/CustomText'
import { stateObject } from 'src/utils/state'
import { SizeList } from 'src/styles/size'
import { GlobalHeader } from 'src/components/Header/Header'
import { getSubProducts, setMarginProduct } from 'src/utils/api/setupharga'
import { Dropdown, AwanPopup } from 'src/components/ModalContent/Popups'
import { convertRupiah } from 'src/utils/authhelper'
import { ColorsList } from 'src/styles/colors'
import { Button } from 'src/components/Button/Button'
import { $Border } from 'src/utils/stylehelper'
import BottomSheetSelect from 'src/components/Picker/BottomSheetSelect'
import IconFA from 'react-native-vector-icons/FontAwesome5'
import { Icon } from 'native-base'

const SubProduct = ({ navigation }) => {
	const [dropdownVisible, setDropdownVisible] = useState(false)
	const [products, setProducts] = useState([])
	const [providerSelected, setProviderSelected] = useState()
	const [subProduct, setSubProduct] = useState([])
	const [product] = useState(navigation.state.params)
	const [productMargin, setProductMargin, resetProductMargin] = stateObject()
	const [alertProps, setAlertProps] = stateObject({
		title: 'Perhatian',
		visible: false,
		closeAlert: () => setAlertProps({ visible: false })
	})
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
				setAlertProps({
					visible: true,
					message: 'Silahkan simpan biaya admin anda terlebih dahulu'
				})
			} else {
				setProviderSelected(provider)
				const { data, status } = await getSubProducts(product.type, provider.code)
				resetProductMargin()
				if (status == 200) {
					setProducts([])
					setTimeout(() => setProducts(data), 50)
				}
			}
		}
	}
	const _saveMargin = async () => {
		let { type } = product
		let finalMargins = Object.keys(productMargin).rMap(i => {
			let { margin, price, productID, product: name } = productMargin[i] || {}
			if (product.product_type == 3) {
				margin = margin.extractNumber() - price
			}
			if (!productID) {
				return {}
			}
			return { productID, product: name, margin, type }
		})
		const { status, data } = await setMarginProduct(finalMargins)
		if (status == 200) {
			_selectProvider(providerSelected, true)
		} else {
			setAlertProps({
				visible: true,
				message: data.error.msg
			})
		}
	}

	const renderList = () => {
		if (product.product_type == 1) {
			return <View style={styles.viewShadow}>
				{renderProductType1()}
			</View>
		}
		if (product.product_type == 2) {
			return <View style={styles.viewShadow}>
				{renderProductType2()}
			</View>
		}
		if (product.product_type == 3) {
			return <View style={styles.viewShadow}>
				{renderProductType3()}
			</View>
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
			return <View key={i.toString()}>
				<Wrapper spaceBetween style={{ backgroundColor: ColorsList.white }}>
					<View style={{ padding: 10 }}>
						<Text color="greyFontHard">{item.name}</Text>
						{!show(item) && <View>
							<Text>Admin : {convertRupiah(productMargin[key] && productMargin[key].margin || item.margin)}</Text>
							<Text>Cashback : {convertRupiah(renderCashback())}</Text>
						</View>}
					</View>
					{show(item) ?
						<Text style={{ marginRight: SizeList.base }}>Cashback : {convertRupiah(renderCashback())}</Text> :
						<Button color="linkPrimary" onPress={() => _openCashback(item)}>Pilih Biaya Admin</Button>
					}
				</Wrapper>
				{
					show(item) && <View style={{ backgroundColor: ColorsList.white, paddingHorizontal: SizeList.base }}>
						<Input
							currency disabled
							label="Biaya Admin"
							value={renderCashback().toString()}
						/>
						<Text style={{ marginTop: SizeList.secondary }}>Pilih jumlah biaya admin</Text>
						<Wrapper flexContent style={{ marginVertical: 10 }}>
							{
								[2000, 2500, 3000, 3500].rMap((btn, i) => {
									return <Button
										key={i.toString()}
										active={productMargin[key] && productMargin[key].margin == btn || !productMargin[key].margin && btn == item.margin}
										style={{ marginHorizontal: 1 }}
										onPress={() => _pilihCashback(item, btn)}
										textProps={{ size: 10 }}
										color={["white", "greyFontHard", "borderColor"]}
										activeColor="primary"
										children={convertRupiah(btn)}
									/>
								})
							}
						</Wrapper>
						<Button
							disabled
							style={{ borderRadius: SizeList.borderRadius, marginBottom: 10 }}
							color={["cashbackBg"]}>
							<View>
								<Wrapper flexStart>
									<IconFA style={{ color: ColorsList.cashbackFont, marginRight: SizeList.secondary }} name="coins" />
									<Text color="cashbackFont">CASHBACK</Text>
								</Wrapper>
								<Text color="cashbackFont">{`Cashback yang di dapat oleh mitra sebesar ${convertRupiah(renderCashback())}`}</Text>
							</View>
						</Button>
					</View>
				}
				{i < products.length && <Divider />}
			</View>
		}
		return <View style={{ flex: 1, paddingTop: 10 }}>
			<Text style={{ marginBottom: SizeList.base }}>Jumlah cashback menyesuaikan biaya admin yang dipilih</Text>
			{products.rMap(renderMap)}
		</View>
	}

	const renderProductType2 = () => {
		return null
	}
	const renderProductType3 = () => products.rMap((item, i) => {
		let { price, productID, name, price_sale } = item
		let _key = `${productID}${name}`
		let value = () => {
			return productMargin[_key] &&
				productMargin[_key].margin.toString() || price_sale.toString()
		}
		return <View>
			<Wrapper key={i.toString()} style={styles.wrapper} justify="space-between">
				<View _flex style={styles.leftWrapper}>
					<Text font="SemiBold" color="greyFontHard">{name}</Text>
					<Text>Modal : {convertRupiah(price)}</Text>
				</View>
				<MDInput
					onChangeText={margin => setProductMargin({
						[_key]: { margin, productID, product: name, price }
					})}
					onBlur={() => {
						if (!(productMargin[_key] && productMargin[_key].margin.extractNumber() > parseInt(price))) {
							setProductMargin({ [_key]: null })
							setAlertProps({
								visible: true,
								message: 'Harga Jual Harus Lebih Besar Dari Harga Modal'
							})
						}
					}}
					currency
					_style={styles.rightWrapper} value={value()} label="Harga Jual" />
			</Wrapper>
			{i < products.length && <Divider style={{ paddingHorizontal: SizeList.padding }} />}
		</View>
	})

	const render = () => {
		const [cari, setCari] = useState('')
		const selectFilter = subProduct.filter(({ operator }) => operator.toLowerCase().includes(cari.toLowerCase()))
		return <View style={{ flex: 1 }}>
			{
				['pulsa', 'kuota'].includes(product.type) && <BottomSheetSelect
					font="SemiBold"
					btnStyle={{ padding: SizeList.bodyPadding }}
					data={selectFilter}
					height={300}
					header={
						<Input
							noLabel
							value={cari}
							onChangeText={txt => setCari(txt)}
							label="Cari layanan seluler"
							renderRightAccessory={() => <Icon style={{ color: ColorsList.primary }} name="search" />}
						/>
					}
					value={!providerSelected ? 'Layanan seluler' : providerSelected.operator}
					closeOnSelect noLabel
					keyExtractor={(a, i) => i.toString()}
					handleChangePicker={item => _selectProvider(item)}
					renderItem={(item, i) => <Button disabled key={i} width={SizeList.width} wrapper={{ justify: 'flex-start', }} key={i} color="link">
						<Image style={{ width: 20, height: 20 }} _style={{ marginRight: 10 }} source={{ uri: item.image }} />
						<Text>{item.operator.toUpperCase()}</Text>
					</Button>
					}
				/>
			}
			<Body style={{ paddingTop: 0 }}>
				{renderList()}
			</Body>
			<Footer>
				<Button width="100%" onPress={_saveMargin}>SIMPAN</Button>
			</Footer>
		</View>
	}

	useEffect(() => {
		_getSubData()
	}, [])

	return <Container>
		<GlobalHeader title={`Atur Harga ${product.product}`} onPressBack={() => navigation.goBack()} />
		<AwanPopup.Alert {...alertProps} />
		{render()}
	</Container>
}

export default SubProduct