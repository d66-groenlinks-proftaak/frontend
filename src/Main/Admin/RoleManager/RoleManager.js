import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import {
  getAuthError,
  getAuthAuthenticating,
} from "../../../Core/Authentication/authentication.selectors";
import { getGlobalConnection } from "../../../Core/Global/global.selectors";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import RoleSettings from "./RoleSettings";
import CreateRole from "./CreateRole";
import { Toast } from "primereact/toast";
import { Divider } from "primereact/divider";

function RoleManager(props) {
  const [Roles, setRoles] = useState([]);
  const [Role, setRole] = useState({
    id: "",
    name: "",
    permissions: [],
  });
  const toast = useRef(null);
  const [Visible, setVisible] = useState(false);

  function onClickRole(selectRole) {
    if (selectRole == null) {
      return;
    } else {
      setRole(selectRole);
    }
  }

  function showToast(errorNumber) {
    if (errorNumber == 0) {
      toast.current.show({
        severity: "success",
        summary: "Gelukt",
        detail: "Rol succesvol aangemaakt.",
        life: 3000,
      });
    } else if (errorNumber == 1) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "De rolnaam is te kort.",
        life: 3000,
      });
    } else if (errorNumber == 2) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "De rolnaam is te lang.",
        life: 3000,
      });
    } else if (errorNumber == 3) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Er bestaat al een rol met deze naam.",
        life: 3000,
      });
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
      let permissions = [];
      for (let index = 0; index < prole.permissions.length; index++) {
        const element = prole.permissions[index];
        permissions.push(element.perm);
      }
      return <RoleSettings permissions={permissions} role={prole} />;
    }
  }
  function getRoleList() {
    props.connection.send("GetRoleList");
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
    <div className={"p-grid"} style={{ width: "100%" }}>
      <Toast ref={toast} />
      <div class="p-col-12">
        <h1>Rollenbeheer</h1>
        <h4>Hier kunt u nieuwe rollen aanmaken of bestaande rollen bewerken</h4>
        <Divider/>
      </div>

      <div className={"p-col-3"}>
        <div className={"m-m-1 p-p-0 p-text-bold"} style={{ fontSize: "2em" }}>
          Alle Rollen {""}
          <Button
            icon="pi pi-plus"
            iconPos="right"
            onClick={() => setVisible(true)}
          />
        </div>
        <br />
        <ListBox
          optionLabel="name"
          value={Role}
          options={Roles}
          onChange={(e) => onClickRole(e.value)}
        />
      </div>

      <div className={"p-col-9"}>{showRoleDetails(Role)}</div>
      <CreateRole
        refresh={getRoleList()}
        hide={() => setVisible(false)}
        toast={(errorNumber) => showToast(errorNumber)}
        visible={Visible}
      ></CreateRole>
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
