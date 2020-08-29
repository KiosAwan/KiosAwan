import axiosLib from "axios"
import env from "src/utils/env"

const { apiKey, apiSignature } = env
const axios = axiosLib

axios.defaults.headers.common["X-API-Key"] = apiKey
axios.defaults.headers.common["X-API-Signature"] = apiSignature

export default axios
