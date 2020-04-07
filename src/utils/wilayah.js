import axios from "axios";
import { HOST_URL } from "src/config";

const Wilayah = {
	Provinsi: async () => {
		return await axios.get("http://dev.farizdotid.com/api/daerahindonesia/provinsi");
	},
	Kabupaten: async (idProv) => {
		return await axios.get(`http://dev.farizdotid.com/api/daerahindonesia/provinsi/${idProv}/kabupaten`);
	},
	Kecamatan: async (idKab) => {
		return await axios.get(`http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/${idKab}/kecamatan`);
	},
	Desa: async (idKec) => {
		return await axios.get(`http://dev.farizdotid.com/api/daerahindonesia/provinsi/kabupaten/kecamatan/${idKec}/desa`);
	},
	SearchAddress: async pencarian => await axios.get(`${HOST_URL}/address?req=${pencarian}`)
}

export default Wilayah