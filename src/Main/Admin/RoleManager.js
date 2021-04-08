import React, {useState} from 'react';
import {Route, Switch, Redirect} from "react-router-dom";
import {login} from "../../Core/Authentication/authentication.actions";
import {useSelector, connect} from "react-redux";
import {
    getAuthError,
    getAuthAuthenticating
} from "../../Core/Authentication/authentication.selectors";
import { MultiSelect } from 'primereact/multiselect';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {getGlobalConnection} from '../../Core/Global/global.selectors'

function RoleManager(props) {
    
    const [selectedPermissions, setSelectedPermissions] = useState(null);
    const [roleName, setRoleName] = useState("");

    const createRole = () => {
        props.connection.send("CreateRole", {
           Name: roleName,
           Permissions: selectedPermissions
        })
    };  

    const poggerslogging = () =>{
        console.log(selectedPermissions);
        console.log(roleName);
    }

    const permissions = [
        {name: 'Ban', code : 0},
        {name: 'Categoriseren', code: 1},
        {name: 'Quiz', code: 2},
        {name: 'Webinar', code: 3},
        {name: 'Mededeling', code: 4}
    ];

    return <div>
        <InputText value={roleName} onChange={(e) => setRoleName(e.target.value, poggerslogging())} />
        <MultiSelect value={selectedPermissions} options={permissions} optionLabel="name" placeholder="Selecteer de rechten" onChange={(e) => setSelectedPermissions(e.value)} />
        <Button label="Aanmaken" onClick={createRole} />
    </div>
}
 
const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), connection : getGlobalConnection(state)}
}

export default connect(mapStateToProps)(RoleManager);