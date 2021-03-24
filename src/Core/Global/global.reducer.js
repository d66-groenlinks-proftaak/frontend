import {Actions} from "./global.actions";

const initialState = {
    connection: undefined,
    darkmode: false
}

export default function globalReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.setConnection:
            return {...state, connection: action.payload.connection}
        case Actions.setDarkMode:
            return {...state, darkmode: action.payload.darkmode}
        default:
            return state;
    }
}
