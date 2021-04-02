import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { login } from "../../../Core/Authentication/authentication.actions";
import { useSelector, connect } from "react-redux";
import {
  getAuthError,
  getAuthAuthenticating,
} from "../../../Core/Authentication/authentication.selectors";
import { getGlobalConnection } from "../../../Core/Global/global.selectors";
import { ListBox } from "primereact/listbox";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import RoleSettings from "./RoleSettings";

function RoleManager(props) {
  const [Roles, setRoles] = useState([]);
  const [Role, setRole] = useState({
    id: "",
    name: "",
    permissions: [],
  });

  function onClickRole(selectRole) {
    if (selectRole == null) {
      return;
    } else {
      setRole(selectRole);
    }
  }

  function showRoleDetails(prole) {
    if (prole.id == "") {
      return (
        <div class="m-m-1 p-p-0 p-text-bold" style={{ fontSize: "2em" }}>
          Selecteer een rol.
        </div>
      );
    } else {
      return <RoleSettings role={prole} />;
    }
  }

  useEffect(() => {
    props.connection.on("ReceiveRoleList", (RoleList) => {
      setRoles(RoleList);
    });

    return function cleanup() {
      props.connection.off("ReceiveRoleList");
    };
  });
  useEffect(() => {
    props.connection.send("GetRoleList");
  }, []);

  return (
    <div class="p-grid" style={{ width: "100%" }}>
      <div class="p-col-12">
        <h1>Rollenbeheer</h1>
      </div>

      <div class="p-col-3">
        <div class="m-m-1 p-p-0 p-text-bold" style={{ fontSize: "2em" }}>
          Alle Rollen <Button icon="pi pi-plus" iconPos="right" />
        </div>
        <br />
        <ListBox
          optionLabel="name"
          value={Role}
          options={Roles}
          onChange={(e) => onClickRole(e.value)}
        />
      </div>

      <div class="p-col-9">{showRoleDetails(Role)}</div>
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

export default connect(mapStateToProps)(RoleManager);
