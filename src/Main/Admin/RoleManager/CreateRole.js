import React, { useEffect, useState } from "react";
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
import { Dialog } from "primereact/dialog";

function CreateRole(props) {
  const [dialogText, setDialogText] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [displayResponsive, setDisplayResponsive] = useState(false);
  const [nameError, setNameError] = useState(false);

  const createRole = () => {
    props.connection.send("CreateRole", {
      Name: roleName,
      Permissions: selectedPermissions,
    });
  };

  const checkError = () => {
    if (roleName.length <= 1)
      setNameError("Uw naam moet langer zijn dan 2 tekens");
    else if (roleName.length >= 19)
      setNameError("Uw naam moet korter zijn dan 20 tekens");
    else setNameError(false);
  };

  useEffect(() => {
    props.connection.on("ConfirmRoleCreation", (Succes) => {
      if (Succes) {
        setDialogText("Rol succesvol toegevoegd.");
      } else {
        setDialogText("Er bestaat al een rol met deze naam.");
      }
      setDisplayResponsive(true);
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
    <div>
      <InputText
        type="text"
        value={roleName}
        onInput={() => checkError()}
        onChange={(e) => setRoleName(e.target.value)}
        id="roleName"
      />
      {nameError ? (
        <span style={{ color: "red" }}> {nameError} </span>
      ) : (
        <span>&nbsp;</span>
      )}
      <MultiSelect
        value={selectedPermissions}
        options={permissions}
        optionLabel="name"
        placeholder="Selecteer de rechten"
        onChange={(e) => setSelectedPermissions(e.value)}
      />
      <Button label="Aanmaken" onClick={createRole} />
      <Dialog
        header={dialogText}
        visible={displayResponsive}
        onHide={() => setDisplayResponsive(false)}
        breakpoints={{ "960px": "75vw" }}
        style={{ width: "50vw" }}
        baseZIndex={1000}
      />
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
