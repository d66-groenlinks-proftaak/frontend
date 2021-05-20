import React from "react";
<<<<<<< Updated upstream
import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";

class Category extends React.Component {
    
    render() {
        return <li className={"category"} style={{fontSize: "1.5em", marginTop: 5, marginLeft: 0}} onClick={() => {if (this.props.connection !== null) this.props.connection.send("RequestUpdate", this.props.name)}}>
=======
import {connect} from "react-redux";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";

class Category extends React.Component {
    getItems(type) {
        this.props.connection.send("RequestUpdate", type)
    }
    
    render() {

        return <li className={"category"} style={{fontSize: "1.5em", marginTop: 5, marginLeft: 0}} onClick = {() => this.getItems(this.props.name)} >
>>>>>>> Stashed changes
            <span className="fa-li">{this.props.icon}</span> {this.props.name}
        </li>
    }
}

<<<<<<< Updated upstream
const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), connection: getGlobalConnection(state)}
}
export default connect(mapStateToProps)(Category)
=======

const mapStateToProps = (state) => {
    return {connection: getGlobalConnection(state)}
}


export default connect(mapStateToProps)(Category);
>>>>>>> Stashed changes
