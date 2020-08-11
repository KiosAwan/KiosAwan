const initialState = {
    name: '',
    phone_number: '',
    otp: '',
    password: '',
    secondpassword: '',
    deviceId: '',
    deviceName: ''
}

const reducerRegistration = (state = initialState, actions) => {
    switch (actions.type) {
        case "ADD_NAME":
            return {
                ...state,
                name: actions.payload
            }
        case "ADD_PHONE":
            return {
                ...state,
                phone_number: actions.payload
            }
        case "ADD_OTP":
            return {
                ...state,
                otp: actions.payload
            }
        case "ADD_PASSWORD":
            return {
                ...state,
                password: actions.payload
            }
        case "ADD_SECOND_PASSWORD":
            return {
                ...state,
                secondpassword: actions.payload
            }
        case "ADD_DEVICE_ID":
            return {
                ...state,
                deviceId: actions.payload
            }
        case "ADD_DEVICE_NAME":
            return {
                ...state,
                deviceName: actions.payload
            }
        case "CLEAR_ALL_REGISTRATION":
            return {
                name: '',
                phone_number: '',
                otp: '',
                password: '',
                secondpassword: '',
                deviceId: '',
                deviceName: ''
            }
        default:
            return state
    }
}

export default reducerRegistration