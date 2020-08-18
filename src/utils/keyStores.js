import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

const storageKey = 'YmlzbWlsbGFoaXJyYWhtYW5pcnJhaGlt'
const apiKey = "LXQ4Y5UI34JK34PR8MPVC3ERZ"
const apiSignature = "LXQ4Y5UI34JK34PR8MPVC3ERZ8YIU7698YhjlhkXJKLFU3LKDSFKLJDSKLFJLK2REXXxdvNZMCNLFD4d"

class Class {
	getItem(key) {
		return new Promise(async resolve => {
			try {
				const data = await RNSecureKeyStore.get(key)
				resolve(data)
			} catch (err) {
				resolve(null)
			}
		})
	}
	setItem(key, value) {
		return new Promise(async resolve => {
			try {
				await RNSecureKeyStore.set(key, value, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })
				resolve(true)
			} catch (err) {
				resolve(false)
			}
		})
	}
	removeItem(key) {
		return new Promise(async resolve => {
			try {
				await RNSecureKeyStore.remove(key)
				resolve(true)
			} catch (err) {
				resolve(false)
			}
		})
	}
}

const Storage = new Class()

export { apiKey, apiSignature, storageKey }
export default Storage