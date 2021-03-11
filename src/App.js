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
import Footer from "./Layout/Footer";

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

    render() {
        if (!this.state.connection || !this.state.connection.connectionStarted)
            return <div>Connecting...</div>
        return (<div style={{height: "100vh", width: "100vw"}}>
                <div className="App p-grid" style={{marginLeft: 0, width: "100vw", height: "100%"}}>
                    <div className={"p-col-12 p-col-align-start"}>
                        <Header connection={this.state.connection}/>
                        <Home connection={this.state.connection}/>
                    </div>
                    <div className={"p-col-12 p-align-col-end"}>
                        <Footer/>
                    </div>
                </div>
            </div>
        )
    }

    4
}

export default withRouter(App);
