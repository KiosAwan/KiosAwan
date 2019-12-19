import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Manajemen from '../../screens/AuthScreen/Drawer/Manajemen'
import ManajemenProduk from '../../screens/AuthScreen/Drawer/Manajemen/Produk'
import ManajemenKategori from '../../screens/AuthScreen/Drawer/Manajemen/Kategori'
import ManajemenDiskon from '../../screens/AuthScreen/Drawer/Manajemen/Diskon'
import ManajemenPelanggan from '../../screens/AuthScreen/Drawer/Manajemen/Pelanggan'
import KategoriAdd from '../../screens/AuthScreen/Drawer/Manajemen/KategoriAdd'
import KategoriEdit from '../../screens/AuthScreen/Drawer/Manajemen/KategoriEdit'
import PelangganAdd from '../../screens/AuthScreen/Drawer/Manajemen/PelangganAdd'
import PelangganEdit from '../../screens/AuthScreen/Drawer/Manajemen/PelangganEdit'
import DiskonAdd from '../../screens/AuthScreen/Drawer/Manajemen/DiskonAdd'
import DiskonEdit from '../../screens/AuthScreen/Drawer/Manajemen/DiskonEdit'
import ManajemenProdukEdit from 'src/screens/AuthScreen/Drawer/Manajemen/ProdukEdit'
import ManajemenProdukEditBarcode from 'src/screens/AuthScreen/Drawer/Manajemen/ProdukEditBarcode'
import ManajemenProdukEditHarga from 'src/screens/AuthScreen/Drawer/Manajemen/ProdukEditHarga'

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
	'/drawer/manajemen/diskon/add': {
		screen: DiskonAdd,
		navigationOptions: {
			header: null
		}
	},
	'/drawer/manajemen/diskon/edit': {
		screen: DiskonEdit,
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