import React from "react";
import {Route, Switch, Redirect} from "react-router-dom";
import {login} from "../../Core/Authentication/authentication.actions";
import {useSelector, connect} from "react-redux";
import {
    getAuthAuthenticated,
    getAuthAuthenticating
} from "../../Core/Authentication/authentication.selectors";
import Categories from "./Categories";
import RoleManager from "./RoleManager";
import ShadowBans from "./ShadowBans";

function AdminPanel (){
    return <div>
        <Categories></Categories>
        <RoleManager></RoleManager>
        <ShadowBans></ShadowBans>
    </div>
}


export default AdminPanel;