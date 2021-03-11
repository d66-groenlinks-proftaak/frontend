import React from "react";
import Announcements from "./Announcements/_index";
import Messages from "./Messages";
import TopMessages from "./TopMessages";

import {
    Switch,
    Route
} from "react-router-dom";
import Message from "./Message";

import Profile from "./Profile"
import {Toast} from "primereact/toast";

const errors = [
    "Geen fout",
    "Tekstbericht was te kort",
    "Tekstbericht was te lang",
    "Titel was te kort",
    "Tekstbericht was te lang",
    "Naam was te kort",
    "Naam was te lang",
    "Email was ongeldig",
    "Er bestaat al een account met dit e-mail adres, log hiermee in als dit uw account is",
]

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.toastRef = React.createRef();
    }

    componentDidMount() {
        this.props.connection.on("MessageCreationError", err => {
            console.log(err);
            console.log(err);
            console.log(err);
            console.log(err);

            this.toastRef.current.show({
                severity: 'error',
                summary: "Foutmelding",
                detail: errors[err],
                sticky: true
            })
        })
    }

    render() {
        return <div style={{width: "100%"}} className="p-grid p-formgrid p-fluid">
            <div className="p-col-12 p-md-3 p-pl-3">
                <Announcements/>
            </div>

            <div className="p-col-12 p-md-6 p-pl-3">
                <Switch>
                    <Route path={"/thread/:id"} render={(props) =>
                        <Message loggedIn={this.props.loggedIn} connection={this.props.connection}
                                 id={props.match.params.id}/>
                    }/>

                    <Route path={"/profile/:id"} render={(props) =>
                        <Profile connection={this.props.connection} id={props.match.params.id}/>
                    }/>

                    <Route path={"/"}>
                        <h1>Top Berichten</h1>
                        <TopMessages/>
                        <Messages loggedIn={this.props.loggedIn} connection={this.props.connection}/>
                    </Route>
                </Switch>
            </div>

            <div className="p-col-12 p-md-3 p-pl-3">

            </div>

            <Toast ref={this.toastRef}/>
        </div>
    }
}

export default Home;
