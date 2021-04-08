
import React, {useState} from "react";
import "./admin.css";

import Categories from "./Categories";

import RoleManager from "./RoleManager/RoleManager";
import ShadowBans from "./ShadowBan/ShadowBans";
import { Menu } from 'primereact/menu';
function AdminPanel (){

    const [window, setWindow] = useState("report");

    let items = [
        {label: 'Gerapporteede berichten', command: (e) =>{
                setWindow("report")
            }},
        {label: 'Categorieën', command: (e) =>{
                setWindow("catergorie")
            }},
        {label: 'Rollen Beheren' , command: (e) =>{
                setWindow("rollen")
            }}
    ];
    return <div className={"p-col-12 p-grid p-justify-center"}>
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

                
                
}

export default AdminPanel;
