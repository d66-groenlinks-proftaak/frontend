import {applyMiddleware, combineReducers, createStore} from "redux";
import authenticationReducer from "./Authentication/authentication.reducer";
import thunk from "redux-thunk";
import globalReducer from "./Global/global.reducer";

let rootReducer = combineReducers({
    auth: authenticationReducer,
    global: globalReducer
})

export default createStore(rootReducer, applyMiddleware(thunk));
