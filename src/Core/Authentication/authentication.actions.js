import {getGlobalConnection} from "../Global/global.selectors";

export const Actions = {
    authenticate: "[Authentication] Login",
    loginSuccess: "[Authentication] Login Success",
    loginSuccessInternal: "[Authentication] Login Success Internal",
    register: "[Authentication] Register",
    authenticateFailed: "[Authentication] Failed"
}

const authenticate = () => ({
    type: Actions.authenticate,
    payload: {}
})

export const authenticateFailed = (error) => ({
    type: Actions.authenticateFailed,
    payload: {
        error
    }
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

export const register = (firstname, lastname, password, email) => {
    return function (dispatch, state) {
        dispatch(authenticate())

        const connection = getGlobalConnection(state());

        connection.send("Register", {
            FirstName: firstname,
            LastName: lastname,
            Password: password,
            Email: email
        })
    }
}

export const login = (username, password, captcha) => {
    return function (dispatch, state) {
        dispatch(authenticate())

        const connection = getGlobalConnection(state());

        connection.send("Login", {
            Email: username,
            Password: password
        });
    }
}
