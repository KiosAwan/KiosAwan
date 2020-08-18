import RNSecureKeyStore, { ACCESSIBLE } from "react-native-secure-key-store";

const storageKey = 'YmlzbWlsbGFoaXJyYWhtYW5pcnJhaGlt'
const apiKey = "LXQ4Y5UI34JK34PR8MPVC3ERZ"
const apiSignature = "LXQ4Y5UI34JK34PR8MPVC3ERZ8YIU7698YhjlhkXJKLFU3LKDSFKLJDSKLFJLK2REXXxdvNZMCNLFD4d"

const getItem = key => RNSecureKeyStore.get(key)
const removeItem = key => RNSecureKeyStore.remove(key)
const setItem = (key, value) => RNSecureKeyStore.set(key, value, { accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY })

export { getItem, setItem, removeItem, apiKey, apiSignature, storageKey }