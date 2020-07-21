import DeviceInfo from 'react-native-device-info';

const APP_VERSION = DeviceInfo.getVersion()

const PPOB_PRODUCT_CODE = {
    PLN_POSTPAID: 10001,
    PLN_PREPAID: 10002,
    NON_TAGLIST: 10003,
    PULSA: 10004,
    KUOTA: 10005,
    PDAM: 10011,
    TELKOM_GROUP: 10006,
}
export { APP_VERSION, PPOB_PRODUCT_CODE }