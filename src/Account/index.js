import React from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Link, Route, Switch, Redirect} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";

class Account extends React.Component {
    render() {
        return <div>
            <Switch>
                <Route path={"/account/login"} render={(props) => {
                    if (this.props.loggedIn)
                        return <Redirect to={"/"}/>

                    return <Login
                        authenticationError={this.props.authenticationError}
                        login={(username, password, cb) => this.props.login(username, password, cb)} {...props} />
                }}/>

                <Route path={"/account/register"} render={(props) => {
                    if (this.props.loggedIn)
                        return <Redirect to={"/"}/>

                    return <Register
                        authenticationError={this.props.authenticationError}
                        register={(firstname, lastname, password, email) => this.props.register(firstname, lastname, password, email)} {...props} />
                }}/>
            </Switch>
        </div>
    }
}

export default Account;
