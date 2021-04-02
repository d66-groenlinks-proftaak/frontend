import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { login } from "../../Core/Authentication/authentication.actions";
import { useSelector, connect } from "react-redux";
import {
  getAuthAuthenticated,
  getAuthAuthenticating,
} from "../../Core/Authentication/authentication.selectors";
import Categories from "./Categories";
import RoleManager from "./RoleManager/RoleManager";
import ShadowBans from "./ShadowBans";

function AdminPanel() {
  return (
    <div class="p-col-8">
      <Categories></Categories>
      <RoleManager></RoleManager>
      <ShadowBans></ShadowBans>
    </div>
  );
}

export default AdminPanel;
