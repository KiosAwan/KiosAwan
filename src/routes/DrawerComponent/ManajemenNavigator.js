import Manajemen from "src/screens/AuthScreen/Drawer/Manajemen"
import ManajemenProduk from "src/screens/AuthScreen/Drawer/Manajemen/Produk"
import ManajemenProdukEdit from "src/screens/AuthScreen/Drawer/Manajemen/ProdukEdit"
import ManajemenProdukEditBarcode from "src/screens/AuthScreen/Drawer/Manajemen/ProdukEditBarcode"
import ManajemenProdukEditHarga from "src/screens/AuthScreen/Drawer/Manajemen/ProdukEditHarga"
import ManajemenKategori from "src/screens/AuthScreen/Drawer/Manajemen/Kategori"
import KategoriAdd from "src/screens/AuthScreen/Drawer/Manajemen/KategoriAdd"
import KategoriEdit from "src/screens/AuthScreen/Drawer/Manajemen/KategoriEdit"
import ManajemenDiskon from "src/screens/AuthScreen/Drawer/Manajemen/Diskon"
import DiskonAdd from "src/screens/AuthScreen/Drawer/Manajemen/DiskonAdd"
import DiskonEdit from "src/screens/AuthScreen/Drawer/Manajemen/DiskonEdit"
import ManajemenPelanggan from "src/screens/AuthScreen/Drawer/Manajemen/Pelanggan"
import PelangganAdd from "src/screens/AuthScreen/Drawer/Manajemen/PelangganAdd"
import PelangganEdit from "src/screens/AuthScreen/Drawer/Manajemen/PelangganEdit"

const ManajemenNavigator = {
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
}
export default ManajemenNavigator