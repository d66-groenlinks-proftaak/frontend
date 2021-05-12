import {Actions} from "./global.actions";

const initialState = {
    connection: undefined,
    darkmode: false,
    permissions: []
}

export default function globalReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.setConnection:
            return {...state, connection: action.payload.connection}
        case Actions.setDarkMode:
            return {...state, darkmode: action.payload.darkmode}
        case Actions.setPermissions:
            return  {...state, permissions: action.payload.permissions}
        default:
            return state;
    }
}
