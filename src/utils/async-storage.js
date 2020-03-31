import AsyncStore from "@react-native-community/async-storage";
const AsyncStorage = {}
AsyncStorage.put = async (key, value) => {
	let newValue = value;
	if (typeof value == 'object') newValue = JSON.stringify(value);
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
AsyncStorage.getObj = async arr => {
	var ret = {}
	if (!Array.isArray(arr)) arr = [];
	for (var i in arr) {
		ret[arr[i]] = await AsyncStorage.get(arr[i]);
	}
	return ret;
}
AsyncStorage.getAll = async () => {
	try {
		const keys = await AsyncStorage.getAllKeys()
		return await AsyncStorage.getObj(keys)
	} catch (error) {
		return false
	}
}
AsyncStorage.clear = async () => {
	try {
		const keys = await AsyncStorage.getAllKeys()
		keys.forEach(async key => {
			AsyncLocalStorage.remove(key)
		});
	} catch (err) {
		return false
	}
}
export default AsyncStorage