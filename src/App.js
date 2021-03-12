import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import Home from "./Home";
import Header from "./Header";
import React from "react";
import {Route, Switch, withRouter} from "react-router-dom";
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
            authenticationError: false
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
            return <div>Connecting...</div>
        return (<div>
                <PageListener connection={this.state.connection}/>
                <Header accountId={this.state.accountId} accountName={this.state.accountName}
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

                <Footer/>
            </div>
        )
    }

    4
}

export default withRouter(App);
