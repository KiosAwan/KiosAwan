import axios from "axios"
import { HOST_URL } from "src/config"
import { getUserToken } from "./authhelper"

const HOST_WILAYAH = "http://dev.farizdotid.com"

const Wilayah = {
	Provinsi: async () => {
		return await axios.get(`${HOST_WILAYAH}/api/daerahindonesia/provinsi`)
	},
	Kabupaten: async idProv => {
		return await axios.get(
			`${HOST_WILAYAH}/api/daerahindonesia/provinsi/${idProv}/kabupaten`,
		)
	},
	Kecamatan: async idKab => {
		return await axios.get(
			`${HOST_WILAYAH}/api/daerahindonesia/provinsi/kabupaten/${idKab}/kecamatan`,
		)
	},
	Desa: async idKec => {
		return await axios.get(
			`${HOST_WILAYAH}/api/daerahindonesia/provinsi/kabupaten/kecamatan/${idKec}/desa`,
		)
	},
	SearchAddress: async pencarian => {
		const userToken = await getUserToken()
		return await axios.get(`${HOST_URL}/address?req=${pencarian}`, {
			headers: { authorization: userToken },
		})
	},
}

export default Wilayah
