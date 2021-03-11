import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import LoadingProfile from "./loadingProfile";

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      role: ""
    }
  }

  componentDidMount() {
    this.props.connection.on("SendProfile", profile => {
      this.state.firstname = profile.firstname
      this.state.lastname = profile.lastname
      this.state.email = profile.email
    })

    this.props.connection.send("GetProfile")
  }

  click() {
      this.props.connection.send("GetProfile")

    }

  render() {
    return <div>
      <div>
        <Link to={"/"}>
          <Button className={"p-button-secondary"} label={"Terug"} style={{float: "right"}} icon="pi pi-arrow-left" iconPos="left" />
        </Link>
      </div>

      <Button onClick={() => { this.click() }}>Get</Button>

      <div>
        <h1>Naam: {this.state.firstname} {this.state.lastname}</h1>
        <div>Email: {this.state.email}</div>
      </div>
    </div>
  }
}

export default Profile;