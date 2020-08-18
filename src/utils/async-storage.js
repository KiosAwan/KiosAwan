import * as AsyncStore from "src/utils/keyStores";
const AsyncStorage = {}
AsyncStorage.put = async (key, value) => {
	let newValue = value;
	if (typeof value == 'object') newValue = JSON.stringify(value);
	if (typeof value == 'boolean') newValue = value.toString()
	await AsyncStore.setItem(key, newValue)
}
AsyncStorage.get = async key => {
	let value = await AsyncStore.getItem(key);
	try {
		if (["{", "["].includes(value.charAt(0))) {
			return JSON.parse(value);
		} else {
			if (value == "true") {
				return true;
			} else if (value == "false") {
				return false;
			}
			return value;
		}
	} catch (err) {
		return undefined;
	}
}
AsyncStorage.remove = async (...param) => {
	return await AsyncStore.removeItem(...param)
}
AsyncStorage.putObj = async obj => {
	if (typeof obj != 'object') obj = {}
	for (let key in obj) {
		await AsyncStorage.put(key, obj[key])
	}
}
AsyncStorage.getObj = async (arr = [], retArr = false) => {
	let ret = retArr ? [] : {}
	for (let i = 0; i < arr.length; i++) {
		if (retArr) {
			ret.push(await AsyncStorage.get(arr[i]))
		} else {
			ret[arr[i]] = await AsyncStorage.get(arr[i])
		}
	}
	return ret;
}
AsyncStorage.getAll = async retArr => {
	try {
		const keys = await AsyncStore.getAllKeys();
		const result = await AsyncStore.multiGet(keys);
		return result.reduce((obj, [key, value]) => {
			obj[key] = value
			return obj
		}, {})
	} catch (error) {
		return false
	}
}
AsyncStorage.clear = async () => {
	try {
		const keys = await AsyncStorage.getAllKeys()
		keys.forEach(async key => {
			AsyncStorage.remove(key)
		});
	} catch (err) {
		return false
	}
}
export default AsyncStorage