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
import ShadowBans from "./ShadowBan/ShadowBans";

function AdminPanel (){
    return <div style={{width: "100%"}}>
        <Categories></Categories>
        <RoleManager></RoleManager>
        <ShadowBans style={{width: "100%"}}></ShadowBans>
    </div>
}


export default AdminPanel;