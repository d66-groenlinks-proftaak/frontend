import {getGlobalConnection} from "../Global/global.selectors";

export const Actions = {
    loggingIn: "[Authentication] Login",
    loginSuccess: "[Authentication] Login Success",
    loginSuccessInternal: "[Authentication] Login Success Internal"
}

const loggingIn = () => ({
    type: Actions.loggingIn,
    payload: {}
})

export const loginSuccess = (email, id, token) => {
    return function (dispatch, state) {
        localStorage.setItem("token", token);
        dispatch(loginSuccessInternal(email, id, token));
    }
}

const loginSuccessInternal = (email, id, token) => ({
    type: Actions.loginSuccessInternal,
    payload: {
        email,
        id,
        token
    }
})

export const login = (username, password, captcha) => {
    return function (dispatch, state) {
        dispatch(loggingIn())

        const connection = getGlobalConnection(state());

        connection.send("Login", {
            Email: username,
            Password: password
        });
    }
}
