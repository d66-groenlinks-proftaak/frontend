import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import { Avatar } from 'primereact/avatar';


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      firstname: "",
      lastname: "",
      email: "",
      enableImage: true,
      image: ""
    }

    this.props.connection.send("GetProfile", this.state.id)
  }

  componentDidMount() {
    this.props.connection.on("SendProfile", profile => {
      console.log(profile)
      this.setState({
        firstname: profile.firstname,
        lastname: profile.lastname,
        email: profile.email
      })

      this.props.connection.send("GetProfile", this.state.id)
    })
  }

  getProfilePic() {
    if (this.state.enableImage && this.state.image !== "") return <Avatar image={this.state.image} size="xlarge" />
    else if (this.state.firstname !== "") return <Avatar label={this.state.firstname[0]} size="xlarge" />
    else return <Avatar icon="pi pi-user" size="xlarge" />
  }

  render() {
    return (
    <div>
      <div>
        <Link to={"/"}>
          <Button className={"p-button-secondary"} label={"Terug"} style={{float: "right"}} icon="pi pi-arrow-left" iconPos="left" />
        </Link>

          <Link key={this.state.id} style={{ textDecoration: 'none' }} to={"/profile/" + this.state.id}>
            {this.getProfilePic()}

            <div>
              <h1>Naam: {this.state.firstname} {this.state.lastname}</h1>
              <div>Email: {this.state.email}</div>
            </div>  
          </Link>
      </div>
    </div>
    )
  }
}

export default Profile;