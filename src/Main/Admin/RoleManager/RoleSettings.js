import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { login } from "../../../Core/Authentication/authentication.actions";
import { useSelector, connect } from "react-redux";
import {
  getAuthError,
  getAuthAuthenticating,
} from "../../../Core/Authentication/authentication.selectors";
import { getGlobalConnection } from "../../../Core/Global/global.selectors";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";

function RoleSettings(props) {
  const [selectedPermissions, setSelectedPermissions] = useState(null);

  const permissions = [
    { name: "Ban", code: 0 },
    { name: "Categoriseren", code: 1 },
    { name: "Quiz", code: 2 },
    { name: "Webinar", code: 3 },
    { name: "Mededeling", code: 4 },
  ];
  useEffect(() => {
    let permsToSet = [];
    for (let index = 0; index < props.permissions.length; index++) {
      const element = props.permissions[index];
      for (let index2 = 0; index2 < permissions.length; index2++) {
        const element2 = permissions[index2];
        if (element == element2.code) {
          permsToSet.push(element2);
        }
      }
    }
    setSelectedPermissions(permsToSet);
  }, [props.role]);

  useEffect(() => {
    props.connection.on("ConfirmRoleEdit", (Success) => {
      console.log(Success);
    });

    return function cleanup() {
      props.connection.off("ConfirmRoleEdit");
    };
  }, []);

  const editRole = () => {
    props.connection.send("EditRole", {
      Name: props.role.name,
      Permissions: selectedPermissions,
    });
  };

  return (
    <div class="p-grid" style={{ width: "100%" }}>
      <div class="m-m-1 p-p-0 p-text-bold" style={{ fontSize: "2em" }}>
        {props.role.name}
      </div>
      <br />
      <MultiSelect
        style={{ width: "100%" }}
        value={selectedPermissions}
        options={permissions}
        optionLabel="name"
        placeholder="Selecteer de rechten"
        onChange={(e) => setSelectedPermissions(e.value)}
      />
      <Button onClick={editRole} label="Opslaan" />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    error: getAuthError(state),
    loggingIn: getAuthAuthenticating(state),
    connection: getGlobalConnection(state),
  };
};

export default connect(mapStateToProps)(RoleSettings);
