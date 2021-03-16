import React from "react";
import Messages from "./Messages";

import {
    Switch,
    Route
} from "react-router-dom";
import Message from "./Message";

import Profile from "./Profile"
import {Toast} from "primereact/toast";
import Categories from "./Categories";

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
            this.toastRef.current.show({
                severity: 'error',
                summary: "Foutmelding",
                detail: errors[err],
                sticky: true
            })
        })
    }

    render() {
        return <div style={{width: "100%"}} className="p-grid p-justify-center p-nogutter p-pl-2 p-pr-2">
            <Switch>
                <Route path={"/thread/:id"} render={(props) =>
                    <div className={"p-col-12 p-md-8"}>
                        <Message loggedIn={this.props.loggedIn} connection={this.props.connection}
                                 id={props.match.params.id}/>
                    </div>
                }/>

                <Route path={"/"}>
                    <div className={"p-col-12 p-sm-2 p-md-2 p-xl-1 hidden-sm hidden-xs"}>
                        <Categories/>
                    </div>
                    <div className="p-col-12 p-md-7 p-pl-5">
                        <Switch>
                            <Route path={"/profile/:id"} render={(props) =>
                                <Profile connection={this.props.connection} id={props.match.params.id}/>
                            }/>

                            <Route path={"/"}>
                                <Messages loggedIn={this.props.loggedIn} connection={this.props.connection}/>
                            </Route>
                        </Switch>
                    </div>
                </Route>
            </Switch>

            <Toast ref={this.toastRef}/>
        </div>
    }
}

export default Home;
