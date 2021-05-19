import React, {useEffect, useState} from "react";
import "./admin.css";

import RoleManager from "./RoleManager/RoleManager";
import ShadowBans from "./ShadowBan/ShadowBans";
import { Menu } from 'primereact/menu';

import CreatePoll from "../Home/Poll/CreatePoll";

import {getPermissions} from "../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {getAuthAuthenticating, getAuthError} from "../../Core/Authentication/authentication.selectors";
import {Redirect} from "react-router-dom";

function AdminPanel (props){

    const [window, setWindow] = useState("");

    const [items, setItems]  = useState([
        {label: 'Thema Beheer', command: (e) =>{
                setWindow("categorie")
            }},
    ]);
    const fillItems = () =>{
        if(props.permissions.includes(0)){
            let currentItems = items;
            currentItems.push({label: 'Gerapporteerde berichten', command: (e) =>{
                    setWindow("report")
                }});
            setItems(currentItems);
        }
        if(props.permissions.includes(5)){
            let currentItems = items;
            currentItems.push({label: 'Rollen Beheer' , command: (e) =>{
                    setWindow("rollen")
                }});
            setItems(currentItems);
        }
        console.log(items);
    };
    useEffect(() => {
        fillItems();
        },[]);

    if(!props.permissions.includes(6))
        return <Redirect to="/" />
    return<div className={"p-col-12 p-grid p-justify-center"}>
        <div className={"p-col-8"} style={{marginTop: "10px"}}>
        <div className={"p-grid"}>
            <div className={"p-col-2"}>

                <Menu className={"admin-menu"} model={items}> </Menu>
            </div>

            <div className={"p-col-10"}>
                {window !== undefined && window === "report" ? <ShadowBans className={"max-width"}></ShadowBans>: <span/>}
                {window !== undefined && window === "categorie" ? <CreatePoll></CreatePoll>: <span/>}
                {window !== undefined && window === "rollen" ? <RoleManager></RoleManager>: <span/>}
            </div>
        </div>
    </div>
</div>
                
                
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), permissions: getPermissions(state)}
}

export default connect(mapStateToProps)(AdminPanel);
