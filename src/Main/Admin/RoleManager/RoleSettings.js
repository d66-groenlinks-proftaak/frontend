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
  const [Permissions, setPermissions] = useState(null);

  const permissions = [
    { name: "Ban", code: 0 },
    { name: "Categoriseren", code: 1 },
    { name: "Quiz", code: 2 },
    { name: "Webinar", code: 3 },
    { name: "Mededeling", code: 4 },
  ];

  return (
    <div class="p-grid" style={{ width: "100%" }}>
      <div class="m-m-1 p-p-0 p-text-bold" style={{ fontSize: "2em" }}>
        {props.role.name}
      </div>
      <br />
      <MultiSelect
        style={{ width: "100%" }}
        value={props.role.permissions}
        options={permissions}
        optionLabel="name"
        placeholder="Selecteer de rechten"
        onChange={(e) => setPermissions(e.value)}
      />
      <Button label="Opslaan" />
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
