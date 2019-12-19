import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Manajemen from '_screens/AuthScreen/Drawer/Manajemen'
import ManajemenDiskon from '_screens/AuthScreen/Drawer/Manajemen/Diskon'
import ManajemenKategori from '_screens/AuthScreen/Drawer/Manajemen/Kategori'
import KategoriAdd from '_screens/AuthScreen/Drawer/Manajemen/KategoriAdd'
import KategoriEdit from '_screens/AuthScreen/Drawer/Manajemen/KategoriEdit'
import ManajemenPelanggan from '_screens/AuthScreen/Drawer/Manajemen/Pelanggan'
import PelangganAdd from '_screens/AuthScreen/Drawer/Manajemen/PelangganAdd'
import PelangganEdit from '_screens/AuthScreen/Drawer/Manajemen/PelangganEdit'
import ManajemenProduk from '_screens/AuthScreen/Drawer/Manajemen/Produk'
import ManajemenProdukEdit from '_screens/AuthScreen/Drawer/Manajemen/ProdukEdit'
import ManajemenProdukEditHarga from '_screens/AuthScreen/Drawer/Manajemen/ProdukEditHarga'
import ManajemenProdukEditBarcode from '_screens/AuthScreen/Drawer/Manajemen/ProdukEditBarcode'

const ManajemenNavigator = createStackNavigator({
	'/drawer/manajemen': {
		screen: Manajemen,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/produk': {
		screen: ManajemenProduk,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/produk/edit': {
		screen: ManajemenProdukEdit,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/produk/edit/barcode': {
		screen: ManajemenProdukEditBarcode,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/produk/edit/harga': {
		screen: ManajemenProdukEditHarga,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/kategori': {
		screen: ManajemenKategori,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/kategori/add': {
		screen: KategoriAdd,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/kategori/edit': {
		screen: KategoriEdit,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/diskon': {
		screen: ManajemenDiskon,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/pelanggan': {
		screen: ManajemenPelanggan,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/pelanggan/add': {
		screen: PelangganAdd,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/pelanggan/edit': {
		screen: PelangganEdit,
		navigationOptions: {
			header: null
		}
	},
})
export default createAppContainer(ManajemenNavigator)