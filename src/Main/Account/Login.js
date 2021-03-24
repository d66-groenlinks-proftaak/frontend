import React from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {Link} from "react-router-dom";
import {Password} from "primereact/password";

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    onChangeUsername(obj) {
        this.setState({
            username: obj.target.value
        })
    }

    onChangePassword(obj) {
        this.setState({
            password: obj.target.value
        })
    }

    render() {
        return <div className={"p-grid p-nogutter p-justify-center"}>
            <div className={"p-col-12 p-md-4 p-lg-3 p-xl-2"}>
                <h1 style={{textAlign: "center"}}>Login</h1>

                <div className="p-fluid">
                    <div className="p-field p-grid p-nogutter">
                        <label htmlFor="username" className="p-col-12">Gebruikersnaam</label>
                        <div className="p-col-12">
                            <InputText onInput={(input) => this.onChangeUsername(input)} value={this.state.username}
                                       id="username" type="text"/>
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="password" className="p-col-12">Wachtwoord</label>
                        <div className="p-col-12">
                            <Password feedback={false} onInput={(input) => this.onChangePassword(input)}
                                      value={this.state.password}
                                      id="password" type="text"/>
                        </div>
                    </div>

                    <Button disabled={this.props.loggingIn} onClick={() => {
                        this.props.login(this.state.username, this.state.password);
                    }} label={"Login"}/>

                    <Divider/>
                    <p style={{textAlign: "center"}}>Heeft u nog geen account?</p>
                    <Link to={"/account/register"}>
                        <Button className={"p-button-secondary"} label={"Aanmelden"}/>
                    </Link>

                </div>
            </div>
        </div>
    }
}

export default Login;
