import React from "react";
import Announcements from "./Announcements/_index";
import Messages from "./Messages";
import TopMessages from "./TopMessages";

import {
    Switch,
    Route
} from "react-router-dom";
import Message from "./Message";



class Home extends React.Component {
    render() {
        return <div style={{width: "100%"}} className="p-grid p-formgrid p-fluid">
            <div className="p-col-12 p-md-3 p-pl-3">
                <Announcements />
            </div>

            <div className="p-col-12 p-md-6 p-pl-3">
                <Switch>
                    <Route path={"/thread/:id"} render={(props) =>
                        <Message connection={this.props.connection} id={props.match.params.id} />
                    } />

                    <Route path={"/"}>
                        <h1>Top Berichten</h1>
                        <TopMessages />
                        <Messages connection={this.props.connection} />
                    </Route>
                </Switch>
            </div>

            <div className="p-col-12 p-md-3 p-pl-3">

            </div>
        </div>
    }
}

export default Home;