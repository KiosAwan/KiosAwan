import React from 'react'
import { Image } from "react-native"
import { SizeList } from 'src/styles/size'

const Top = props => {
	const _selectProvider = async provider => {
		setDropdownVisible(false)
		if (provider.code != (providerSelected ? providerSelected.code : null)) {
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
	return <Dropdown selected={!providerSelected ? 'Pilih layanan seluler' : providerSelected.operator} visible={dropdownVisible} state={setDropdownVisible} style={[styles.dropdownContentStyle]}>
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
}

export { Top }