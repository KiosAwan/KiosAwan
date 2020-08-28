import axiosLib from "axios"
import { apiKey, apiSignature } from "src/utils/keyStores"

const axios = axiosLib

axios.defaults.headers.common["X-API-Key"] = apiKey
axios.defaults.headers.common["X-API-Signature"] = apiSignature

export default axios
