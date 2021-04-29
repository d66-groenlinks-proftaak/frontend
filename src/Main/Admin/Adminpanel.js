
import React, {useState} from "react";
import "./admin.css";

import Categories from "./Categories";

import RoleManager from "./RoleManager/RoleManager";
import ShadowBans from "./ShadowBan/ShadowBans";
import { Menu } from 'primereact/menu';
import {getPermissions} from "../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {getAuthAuthenticating, getAuthError} from "../../Core/Authentication/authentication.selectors";
import {Redirect, Route} from "react-router-dom";

function AdminPanel (props){

    const [window, setWindow] = useState("report");

    let items = [
        {label: 'Gerapporteede berichten', command: (e) =>{
                setWindow("report")
            }},
        {label: "Thema's", command: (e) =>{
                setWindow("catergorie")
            }},
        {label: 'Rollen Beheren' , command: (e) =>{
                setWindow("rollen")
            }}
    ];
    console.log(props.permissions);
    if(!props.permissions.includes(0))
        return <Redirect to="/" />
    return<div>
        <div className={"p-col-12 p-grid p-justify-center"}>
        <div className={"p-col-8"} style={{marginTop: "10px"}}>
        <div className={"p-grid"}>
            <div className={"p-col-2"}>
                <Menu className={"admin-menu"} model={items}></Menu>
            </div>

            <div className={"p-col-10"}>
                {window !== undefined && window === "report" ? <ShadowBans className={"max-width"}></ShadowBans>: <span/>}
                {window !== undefined && window === "catergorie" ? <Categories></Categories>: <span/>}
                {window !== undefined && window === "rollen" ? <RoleManager></RoleManager>: <span/>}
            </div>
        </div>
    </div>
    </div>
</div>
                
                
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), permissions: getPermissions(state)}
}

export default connect(mapStateToProps)(AdminPanel);
