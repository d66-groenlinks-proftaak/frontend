import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import './index.css';

import Message from "../Messages/Message";


class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      loaded: false,
      firstname: "",
      lastname: "",
      email: "",
      enableImage: false,
      image: "/profile_pictures/1.png",
      messages: []
    }
  }

  /// 
  /// TODO - working implementation of images
  ///

  componentWillMount() {
    this.props.connection.send("GetProfile", this.state.id)
  }

  componentDidMount() {
    this.props.connection.on("SendProfile", profile => {
      console.log(profile)
      this.setState({
        loaded: true,
        firstname: profile.firstName,
        lastname: profile.lastName,
        email: profile.email,
        messages: profile.messages
      })

      //this.props.connection.send("GetProfile", this.state.id)
    })
  }

  getProfilePic() {
    if (this.state.enableImage && this.state.image !== "") return <Avatar image={this.state.image} size="xlarge" />
    else if (this.state.firstname !== "") return <Avatar label={this.state.firstname[0].toUpperCase()} size="xlarge" />
    else return <Avatar icon="pi pi-user" size="xlarge" />
  }

  render() {
    return (
    <div class="p-col-12 p-md-8">
      <div class="profile-info">
        <div class="profile-name">
          <div className="profile-name p-d-flex p-jc-between" style={{width: "100%"}}>
            <div>
              <h1 class="account-name"> 
              {this.getProfilePic()} {this.state.loaded ? this.state.firstname : "loading..."} {this.state.lastname}</h1>
            </div>
            <div>
              <Button className="p-button-text" label="Bewerken" iconPos="right" icon="pi pi-pencil"></Button>
            </div>
          </div>
        </div>
        <div class="account-email">Email: {this.state.email}</div>
      </div>  
      <Divider align="left">
        <span className="p-tag"
          style={{
            backgroundColor: "transparent",
            border: "1px solid #dee2e6",
            color: "#49506c",
            fontSize: "1.2em",
            fontWeight: "normal"
          }}>Berichten</span>
        </Divider>
      <div class="messages">
      {this.state.messages.map(message => {
                return <Link key={message.id} style={{textDecoration: 'none'}} to={"/thread/" + message.id}>
                    <Message guest={message.guest}
                             replies={message.replies}
                             pinned={message.pinned}
                             title={message.title}
                             authorId={message.authorId}
                             author={message.author}
                             created={message.created}>
                        {message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}
                    </Message>
                </Link>
            })}
      </div>
    </div>
    )
  }
}

export default Profile;