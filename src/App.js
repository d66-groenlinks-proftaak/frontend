import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import {connect} from "react-redux";

import Home from "./Main/Home";
import Header from "./Shared/Header";
import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import PageListener from "./Main/Home/PageListener";
import Footer from "./Shared/Layout/Footer";
import Account from "./Main/Account";
import {getDarkMode, getGlobalConnection} from "./Core/Global/global.selectors";
import {setConnection, setDarkMode} from "./Core/Global/global.actions";
import {authenticateFailed, loginSuccess} from "./Core/Authentication/authentication.actions";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.props.dispatch(setDarkMode(localStorage.getItem("dark") === "1"));
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hub/message')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                this.props.dispatch(setConnection(connection))

                connection.send('UpdatePage', this.props.location.pathname);
                connection.on("Authenticated", account => {
                    this.props.dispatch(loginSuccess(account.email, account.accountId, account.token, account.permissions));
                    connection.send("GetLatestPoll");
                });

                connection.on("AuthenticateFailed", error => {
                    this.props.dispatch(authenticateFailed(error))
                });

                connection.on("MessageCreationError", err => {
                    console.log(err);
                })

                if (localStorage.getItem("token")) {
                    connection.send("Authenticate", localStorage.getItem("token"))
                }
            })
    }

    render() {
        if (!this.props.connection || !this.props.connection.connectionStarted)
            return <div style={{height: "100vh"}} className={(this.props.darkmode ? "dark" : "")}>Connecting...</div>
        return (
            <div className={"p-grid p-nogutter " + (this.props.darkmode ? "dark" : "")}
                 style={{width: "100%", height: "100vh"}}>
                <title>Ringkey</title>

                <div className={"p-col-12"}>
                    <PageListener/>
                    <Header/>
                    <Switch>
                        <Route path={"/account"} render={(props) => {
                            return <Account {...props} />
                        }}/>
                        <Route path={"/"} render={(props) => <Home/>}/>
                    </Switch>
                </div>

                <div className={"p-col-12 p-col-align-end footer"}>
                    <Footer/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {connection: getGlobalConnection(state), darkmode: getDarkMode(state)}
}

export default connect(mapStateToProps)(withRouter(App));
