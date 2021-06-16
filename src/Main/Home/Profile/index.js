import React from "react";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {Avatar} from 'primereact/avatar';
import {Divider} from 'primereact/divider';
import {connect} from "react-redux";
import {getAuthEmail} from "../../../Core/Authentication/authentication.selectors";
import {InputTextarea} from 'primereact/inputtextarea';
import CryptoJS from 'crypto-js';
import './index.css';

import Message from "../Messages/Message";
import {InputText} from "primereact/inputtext";
import {getPermissions} from "../../../Core/Global/global.selectors";
import {Checkbox} from "primereact/checkbox";


class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            loaded: false,
            editing: false,
            firstname: "",
            lastname: "",
            email: "",
            enableImage: false,
            image: "/profile_pictures/1.png",
            bio: "Hallo!",
            avatar: "",
            avatarEmail: "",
            messages: [],
            allRoles: [],
            userRoles: [],
            currentActivated: {}
        }
    }

    ///
    /// TODO - working implementation of images
    ///

    toggleEditing() {
        this.setState({
            editing: !this.state.editing
        }, () => {
            if (!this.state.editing) {
                this.props.connection.send("UpdateProfile", {
                    biography: this.state.bio,
                    avatar: this.state.avatarEmail
                })
            }
        })


    }

    setValue(v) {
        this.setState({
            bio: v
        })
    }

    setAvatar(v) {
        this.setState({
            avatarEmail: v
        })
    }

    componentWillMount() {
        this.props.connection.send("GetProfile", this.state.id)
    }

    setRole(r) {
        this.props.connection.send("SetRole", {
            email: this.state.email,
            role: r.value,
            state: r.checked
        })

        this.props.connection.send("GetProfile", this.state.id)
    }

    componentDidMount() {
        this.props.connection.on("SendProfile", profile => {
            this.setState({
                loaded: true,
                firstname: profile.firstName,
                lastname: profile.lastName,
                email: profile.email,
                messages: profile.messages,
                bio: profile.biography,
                avatarEmail: profile.avatar,
                userRoles: profile.roles,
                allRoles: profile.allRoles
            });

            if (profile.avatar.length > 0) {
                const lowerCaseGravatar = profile.avatar.toLowerCase();
                const gravatarHash = CryptoJS.MD5(lowerCaseGravatar);

                this.setState({
                    avatar: "https://www.gravatar.com/avatar/" + gravatarHash,
                    enableImage: true
                });
            }
        })
    }

    getProfilePic() {
        if (this.state.enableImage && this.state.avatar !== "") return <Avatar image={this.state.avatar} size="xlarge"/>
        else if (this.state.firstname !== "") return <Avatar label={this.state.firstname[0].toUpperCase()}
                                                             size="xlarge"/>
        else return <Avatar icon="pi pi-user" size="xlarge"/>
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
                                {this.props.accountName === this.state.email ? <Button onClick={() => {
                                    this.toggleEditing()
                                }} className="p-button-text" label={this.state.editing ? "Opslaan" : "Bewerken"}
                                                                                       iconPos="right"
                                                                                       icon={this.state.editing ? "pi pi-save" : "pi pi-pencil"}/> : ""}
                            </div>
                        </div>
                    </div>

                    {this.state.editing ? <div>
                            <div>
                                <b>Gravatar E-Mail</b><br/>
                                <InputText value={this.state.avatarEmail} onChange={(e) => this.setAvatar(e.target.value)}/>
                            </div>
                            <br/>

                            <b>Biografie</b>
                            <div><InputTextarea style={{width: "100%"}} value={this.state.bio}
                                                onChange={(e) => this.setValue(e.target.value)}/></div>
                            <br/>
                        </div>

                        :

                        <div>
                            {this.state.bio && this.state.bio.length > 0 ? <div>
                                <b>Biografie</b>
                                {this.state.editing ? "" : <div style={{whiteSpace: "pre-wrap"}}>{this.state.bio}</div>}
                            </div> : ""} <br/>
                        </div>}

                    <b>Details</b>
                    <div class="account-email">Email: {this.state.email}</div>
                </div>

                {this.props.permissions.includes(5) ?
                    <div>
                        <h2>Rollen</h2>
                        {this.state.allRoles.map(role => {
                            return <div>
                                 <Checkbox value={role.name} onChange={(e) => this.setRole(e)}
                                                      checked={this.state.userRoles.some(r => r.name == role.name)}></Checkbox>
                                &nbsp;{role.name}
                            </div>
                        })}
                    </div>
                    : ""}
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

const mapStateToProps = (state) => {
    return {accountName: getAuthEmail(state), permissions: getPermissions(state)}
}

export default connect(mapStateToProps)(Profile);
