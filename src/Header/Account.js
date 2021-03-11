import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";

class Account extends React.Component {
    render() {
        if (this.props.loggedIn)
            return <span> {this.props.accountName} </span>
        return <span>
            <Link
                to={"/account/login"}><Button label={"Account"}/></Link>
        </span>
    }
}

export default Account;
