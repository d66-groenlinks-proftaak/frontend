import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import Home from "./Home";
import Header from "./Header";
import React from "react";
import {BrowserRouter, Route, Switch, withRouter} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import PageListener from "./Home/PageListener";
import Footer from "./Layout/Footer";
import Account from "./Account";


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            accountName: false,
            accountId: "",
            registerCallback: undefined,
            loginCallback: undefined,
            authenticationError: false,
            darkMode: (localStorage.getItem("dark") === "1")
        }
    }

    login(username, password) {
        this.setState({
            authenticationError: false
        })

        this.state.connection.send("Login", {
            Email: username,
            Password: password
        });
    }

    register(firstname, lastname, password, email) {
        this.setState({
            authenticationError: false
        })

        this.state.connection.send("Register", {
            FirstName: firstname,
            LastName: lastname,
            Password: password,
            Email: email
        })
    }

    toggleDarkMode = () => {
        localStorage.setItem("dark", (this.state.darkMode) ? "0" : "1");

        this.setState(state => {
            return {darkMode: !state.darkMode};
        })
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hub/message')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                this.setState({
                    connection: connection
                })

                connection.send('UpdatePage', this.props.location.pathname);
                connection.on("Authenticated", account => {
                    this.setState({
                        loggedIn: true,
                        accountName: account.email,
                        accountId: account.accountId
                    });

                    localStorage.setItem("token", account.token);
                });

                connection.on("AuthenticateFailed", error => {
                    console.log(error);
                    this.setState({
                        loggedIn: false,
                        authenticationError: error
                    })
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
        if (!this.state.connection || !this.state.connection.connectionStarted)
            return <div style={{height: "100vh"}} className={(this.state.darkMode ? "dark" : "")}>Connecting...</div>
        return (
            <div className={"p-grid p-nogutter " + (this.state.darkMode ? "dark" : "")}
                 style={{width: "100%", height: "100vh"}}>
                <div className={"p-col-12"}>
                    <PageListener connection={this.state.connection}/>
                    <Header darkMode={this.state.darkMode} toggleDarkMode={() => {
                        this.toggleDarkMode()
                    }} accountId={this.state.accountId} accountName={this.state.accountName}
                            loggedIn={this.state.loggedIn}
                            connection={this.state.connection}/>
                    <Switch>
                        <Route path={"/account"} render={(props) => {
                            return <Account loggedIn={this.state.loggedIn}
                                            authenticationError={this.state.authenticationError}
                                            login={(username, password, cb) => this.login(username, password, cb)}
                                            register={(firstname, lastname, password, email) => this.register(firstname, lastname, password, email)} {...props} />
                        }}/>
                        <Route path={"/"} render={(props) => <Home loggedIn={this.state.loggedIn}
                                                                   connection={this.state.connection}/>}/>
                    </Switch>
                </div>

                <div className={"p-col-12 p-col-align-end footer"}>
                    <Footer/>
                </div>
            </div>
        )
    }
}

export default withRouter(App);
