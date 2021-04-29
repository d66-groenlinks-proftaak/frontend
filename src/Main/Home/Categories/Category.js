import React from "react";
import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";

class Category extends React.Component {
    
    render() {
        return <li className={"category"} style={{fontSize: "1.5em", marginTop: 5, marginLeft: 0}} onClick={() => {if (this.props.connection !== null) this.props.connection.send("RequestUpdate", this.props.name)}}>
            <span className="fa-li">{this.props.icon}</span> {this.props.name}
        </li>
    }
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), connection: getGlobalConnection(state)}
}
export default connect(mapStateToProps)(Category)