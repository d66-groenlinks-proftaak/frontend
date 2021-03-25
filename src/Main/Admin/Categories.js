import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import {login} from "../../Core/Authentication/authentication.actions";
import {useSelector, connect} from "react-redux";
import {
    getAuthError,
    getAuthAuthenticating
} from "../../Core/Authentication/authentication.selectors";

function Categories () {
    return <div>
            
    </div>;
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state)}
}

export default connect(mapStateToProps)(Categories);