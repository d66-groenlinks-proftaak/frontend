import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import {login} from "../../Core/Authentication/authentication.actions";
import {useSelector, connect} from "react-redux";
import {
    getAuthAuthenticated,
    getAuthAuthenticating
} from "../../Core/Authentication/authentication.selectors";

const Account = (props) => {
    return <div>
        <Switch>
            <Route path={"/account/login"} render={(_props) => {
                if (props.authenticated)
                    return <Redirect to={"/"}/>

                return <Login
                    login={(username, password, permissions) => {
                        props.dispatch(login(username, password, "", permissions))
                    }} {..._props} loggingIn={props.authenticating}/>
            }}/>

            <Route path={"/account/register"} render={(_props) => {
                if (props.authenticated)
                    return <Redirect to={"/"}/>

                return <Register
                    register={(firstname, lastname, password, email) => _props.register(firstname, lastname, password, email)} {...props} />
            }}/>
        </Switch>
    </div>
}

const mapStateToProps = state => {
    return {authenticating: getAuthAuthenticating(state), authenticated: getAuthAuthenticated(state)}
}

export default connect(mapStateToProps)(Account);
