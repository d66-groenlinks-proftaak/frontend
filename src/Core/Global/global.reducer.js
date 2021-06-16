import {Actions} from "./global.actions";

const initialState = {
    connection: undefined,
    darkmode: false,
    permissions: [],
    voted: false
}

export default function globalReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.setConnection:
            return {...state, connection: action.payload.connection}
        case Actions.setDarkMode:
            return {...state, darkmode: action.payload.darkmode}
        case Actions.setPermissions:
            return  {...state, permissions: action.payload.permissions}
        case Actions.setVoted:
            return  {...state, voted: action.payload.voted}
        default:
            return state;
    }
}
