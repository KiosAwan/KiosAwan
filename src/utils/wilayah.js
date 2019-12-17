import axios from "axios";

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
	}
}

export default Wilayah