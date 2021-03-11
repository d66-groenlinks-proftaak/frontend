import React from "react";
import {Menubar} from 'primereact/menubar';
import {Link} from "react-router-dom";
import Account from "./Account";

class index extends React.Component {
    render() {
        const menuItems = []

        return <Menubar
            end={<Account accountId={this.props.accountId} accountName={this.props.accountName}
                          loggedIn={this.props.loggedIn}/>}
            start={<Link to={"/"} style={{fontSize: "1.7em", color: "black", textDecoration: 'none'}}
                         className={"p-p-3 p-text-bold"}>Ringkey</Link>} model={menuItems}/>
    }
}

export default index;
