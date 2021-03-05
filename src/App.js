import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import './App.css';

import Home from "./Home";
import Header from "./Home/Header";
import React from "react";
import {withRouter} from "react-router-dom";
import {HubConnectionBuilder} from "@microsoft/signalr";
import PageListener from "./Home/PageListener";

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {}
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

                console.log(this.props.location.pathname);
                connection.send('UpdatePage', this.props.location.pathname);
            })
    }

    render()
    {
        if(!this.state.connection || !this.state.connection.connectionStarted)
            return <div>Connecting...</div>
        return (
            <div className="App">
                    <PageListener connection={this.state.connection}/>
                    <Header connection={this.state.connection} />
                    <Home connection={this.state.connection} />
            </div>
        )
    }
}

export default withRouter(App);
