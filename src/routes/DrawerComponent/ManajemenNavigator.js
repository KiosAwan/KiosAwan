import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import Manajemen from '../../screens/AuthScreen/Drawer/Manajemen'
import ManajemenProduk from '../../screens/AuthScreen/Drawer/Manajemen/Produk'
import ManajemenKategori from '../../screens/AuthScreen/Drawer/Manajemen/Kategori'
import ManajemenDiskon from '../../screens/AuthScreen/Drawer/Manajemen/Diskon'
import ManajemenPelanggan from '../../screens/AuthScreen/Drawer/Manajemen/Pelanggan'

const ManajemenNavigator = createStackNavigator({
	MainManajemen: {
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
	'/drawer/manajemen/kategori': {
		screen: ManajemenKategori,
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
})
export default createAppContainer(ManajemenNavigator)