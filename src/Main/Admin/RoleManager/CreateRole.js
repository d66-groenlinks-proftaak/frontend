import React, { useEffect, useState, useRef } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { login } from "../../../Core/Authentication/authentication.actions";
import { useSelector, connect } from "react-redux";
import {
  getAuthError,
  getAuthAuthenticating,
} from "../../../Core/Authentication/authentication.selectors";
import { MultiSelect } from "primereact/multiselect";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { getGlobalConnection } from "../../../Core/Global/global.selectors";
import { Sidebar } from "primereact/sidebar";

function CreateRole(props) {
  const [selectedPermissions, setSelectedPermissions] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [nameError, setNameError] = useState(false);

  const createRole = () => {
    if (nameError == false) {
      props.connection.send("CreateRole", {
        Name: roleName,
        Permissions: selectedPermissions,
      });
      props.hide();
    }
  };

  const checkError = () => {
    if (roleName.length <= 1)
      setNameError("Uw naam moet langer zijn dan 2 tekens");
    else if (roleName.length >= 19)
      setNameError("Uw naam moet korter zijn dan 20 tekens");
    else setNameError(false);
  };

  useEffect(() => {
    props.connection.on("ConfirmRoleCreation", (Error) => {
      props.toast(Error);
    });

    return function cleanup() {
      props.connection.off("ConfirmRoleCreation");
    };
  }, []);

  const permissions = [
    { name: "Ban", code: 0 },
    { name: "Categoriseren", code: 1 },
    { name: "Quiz", code: 2 },
    { name: "Webinar", code: 3 },
    { name: "Mededeling", code: 4 },
  ];

  return (
    <div className={"p-grid"}>
      <Sidebar
        className={"p-col-12 p-grid p-justify-center p-nogutter"}
        style={{
          overflowY: "scroll",
          overflowX: "hidden",
          width: "100%",
          height: "25vh",
        }}
        position="bottom"
        showCloseIcon={false}
        visible={props.visible}
        onHide={() => props.hide()}
      >
        <div className="new-post-content p-p-3 p-pt-3">
          <InputText
            style={{ width: "100%" }}
            type="text"
            value={roleName}
            onInput={() => checkError()}
            onChange={(e) => setRoleName(e.target.value)}
            id="roleName"
            placeholder="Naam van de rol"
          />
          <div style={{ width: "100%" }}>
            {nameError ? (
              <span style={{ width: "100%", color: "red" }}> {nameError} </span>
            ) : (
              <span>&nbsp;</span>
            )}
          </div>
          <MultiSelect
            style={{ width: "100%" }}
            value={selectedPermissions}
            options={permissions}
            optionLabel="name"
            placeholder="Selecteer de rechten"
            onChange={(e) => setSelectedPermissions(e.value)}
          />
          <br />
          <br />
          <Button
            style={{ width: "100%" }}
            label="Aanmaken"
            onClick={createRole}
          />
        </div>
      </Sidebar>
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

export default connect(mapStateToProps)(CreateRole);
