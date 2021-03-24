import {Actions} from "./authentication.actions";

const initialState = {
    authenticated: false,
    authenticating: false,
    token: "",
    email: "",
    id: ""
}

export default function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.loggingIn:
            return {...state, authenticating: true}
        case Actions.loginSuccessInternal:
            return {
                ...state,
                authenticating: false,
                authenticated: true,
                token: action.payload.token,
                email: action.payload.email,
                id: action.payload.id
            }
        default:
            return state;
    }
}


