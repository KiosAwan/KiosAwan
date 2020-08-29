import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store"

class Class {
	async getItems(keys) {
		const getItem = this.getItem
		const promises = keys.map(async key => {
			const data = await getItem(key)
			return [key, data]
		})
		const data = await Promise.all(promises)
		return data.reduce((stores, [key, data]) => {
			stores[key] = data
			return stores
		}, {})
	}
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
				await RNSecureKeyStore.set(key, value, {
					accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
				})
				resolve(true)
			} catch (err) {
				resolve(false)
			}
		})
	}
	setItems(data) {
		const setItem = this.setItem
		const promises = data.map(async data => await setItem(data[0], data[1]))
		return Promise.all(promises)
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

export default Storage
