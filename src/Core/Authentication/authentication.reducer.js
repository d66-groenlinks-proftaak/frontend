import {Actions} from "./authentication.actions";
import {Errors} from "./authentication.errors";

const initialState = {
    authenticated: false,
    authenticating: false,
    token: "",
    email: "",
    id: "",
    error: ""
}

export default function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.authenticate:
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
        case Actions.authenticateFailed:
            return {
                ...state,
                error: Errors[parseInt(action.payload.error)],
                authenticating: false,
                authenticated: false
            }
        default:
            return state;
    }
}


