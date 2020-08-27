//Action for adding name to reducer 
export const addName = (name) => {
    return {
        type: "ADD_NAME",
        payload: name
    }
}

//Action for adding Phone Number to reducer 
export const addPhoneNumber = (phonenumber) => {
    return {
        type: "ADD_PHONE",
        payload: phonenumber
    }
}

//Action for adding OTP to reducer 
export const addVerifyOTP = (otpNumber) => {
    return {
        type: "ADD_OTP",
        payload: otpNumber
    }
}

//Clear All Data 
export const clearAllRegistration = () => {
    return {
        type: "CLEAR_ALL_REGISTRATION"
    }
}

export const addFirstPassword = (password) => {
    return {
        type: "ADD_PASSWORD",
        payload: password
    }
}

export const addSecondPassword = (password) => {
    return {
        type: "ADD_SECOND_PASSWORD",
        payload: password
    }
}


export const addDeviceId = (deviceId) => {
    return {
        type: "ADD_DEVICE_ID",
        payload: deviceId
    }
}

export const addDeviceName = (deviceName) => {
    return {
        type: "ADD_DEVICE_NAME",
        payload: deviceName
    }
}