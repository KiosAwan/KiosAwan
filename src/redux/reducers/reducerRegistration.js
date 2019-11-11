const initialState = {
    name : '',
    phone_number : '',
    otp : '',
    firstPIN : '',
    secondPIN : ''
}

const reducerRegistration = (state = initialState, actions) => {
    switch(actions.type) {
        case "ADD_NAME" :
            return {
                ...state,
                name : actions.payload
            }
        case "ADD_PHONE" : 
            return {
                ...state,
                phone_number : actions.payload
            }
        case "ADD_OTP" : 
            return {
                ...state,
                otp : actions.payload
            }
        case "ADD_FIRST_PIN" : 
            return {
                ...state,
                firstPIN : actions.payload
            }
        case "ADD_SECOND_PIN" : 
            return {
                ...state,
                secondPIN : actions.payload
            }
        case "CLEAR_ALL_REGISTRATION" : 
            return {
                name : '',
                phone_number : '',
                otp : '',
                firstPIN : '',
                secondPIN : ''
            }
        default : 
            return state            
    }
}

export default reducerRegistration