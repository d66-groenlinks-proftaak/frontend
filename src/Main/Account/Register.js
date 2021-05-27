import React from "react";
import {InputText} from "primereact/inputtext";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {Link} from "react-router-dom";
import {Password} from "primereact/password";
import {connect} from "react-redux";
import {getAuthAuthenticating, getAuthError} from "../../Core/Authentication/authentication.selectors";
import {register} from "../../Core/Authentication/authentication.actions";

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            secondaryPassword: "",
            secondaryPasswordMatches: true,
            firstnameError: false,
            lastnameError: false,
            emailError: false,
            passwordError: false,
            generalError: false,
            loading: false
        }

        // eslint-disable-next-line no-control-regex
        this.emailRegex = new RegExp('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])');
    }

    onChangeEmail(obj) {
        let error = false;

        if (!this.emailRegex.test(obj.target.value))
            error = "Uw email is ongeldig"

        this.setState({
            email: obj.target.value,
            emailError: error
        })
    }

    onChangeFirstName(obj) {
        let error = false;

        if (obj.target.value.length <= 1)
            error = "Uw naam moet langer zijn dan 1 teken"

        if (obj.target.value.length >= 50)
            error = "Uw naam moet korter zijn dan 50 tekens"

        this.setState({
            firstname: obj.target.value,
            firstnameError: error
        })
    }

    onChangeLastName(obj) {
        let error = false;

        if (obj.target.value.length <= 1)
            error = "Uw naam moet langer zijn dan 1 teken"

        if (obj.target.value.length >= 50)
            error = "Uw naam moet korter zijn dan 50 tekens"

        this.setState({
            lastname: obj.target.value,
            lastnameError: error
        })
    }

    onChangePassword(obj) {
        let match = false;

        console.log(obj);

        if (this.state.secondaryPassword === obj.target.value)
            match = true;

        this.setState({
            password: obj.target.value,
            secondaryPasswordMatches: match
        })
    }

    onChangeSecondaryPassword(obj) {
        let match = false;

        if (this.state.password === obj.target.value)
            match = true;

        this.setState({
            secondaryPassword: obj.target.value,
            secondaryPasswordMatches: match
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.authenticationError !== this.props.authenticationError) {
            this.setState({
                loading: false
            })
        }
    }

    render() {
        const header = <h4>Kies een wachtwoord</h4>;
        const footer = (
            <>
                <Divider/>
                <p className="p-mt-2">Suggesties</p>
                <ul className="p-pl-2 p-ml-2 p-mt-0" style={{lineHeight: '1.5'}}>
                    <li>Minimaal 1 kleine letter</li>
                    <li>Minimaal 1 hoofdletter</li>
                    <li>Minimaal 1 getal of leesteken</li>
                    <li>Minimaal 8 karakters</li>
                </ul>
            </>
        );

        return <div className={"p-grid p-justify-center"}>
            <div className={"p-col-12 p-md-8 p-xl-4"}>
                <h1 style={{textAlign: "center"}}>Aanmelden</h1>

                <div className="p-fluid">
                    <div className="p-field p-grid">
                        <label htmlFor="email" className="p-col-12">E-Mail</label>
                        <div className="p-col-12">
                            <InputText onInput={(input) => this.onChangeEmail(input)} value={this.state.email}
                                       id="email" type="email"/>
                        </div>

                        <div className={"p-col-6"}>
                            {this.state.emailError ?
                                <span style={{color: "red"}}> {this.state.emailError} </span> : <span>&nbsp;</span>}
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="firstname" className="p-col-6">Voornaam</label>
                        <label htmlFor="lastname" className="p-col-6">Achternaam</label>
                        <div className="p-col-6">
                            <InputText onInput={(input) => this.onChangeFirstName(input)} value={this.state.firstname}
                                       id="firstname" type="text"/>
                        </div>
                        <div className="p-col-6">
                            <InputText onInput={(input) => this.onChangeLastName(input)} value={this.state.lastname}
                                       id="lastname" type="text"/>
                        </div>

                        <div className={"p-col-6"}>
                            {this.state.firstnameError ?
                                <span style={{color: "red"}}> {this.state.firstnameError} </span> : <span>&nbsp;</span>}
                        </div>
                        <div className={"p-col-6"}>
                            {this.state.lastnameError ?
                                <span style={{color: "red"}}> {this.state.lastnameError} </span> : <span>&nbsp;</span>}
                        </div>
                    </div>
                    <div className="p-field p-grid">
                        <label htmlFor="password" className="p-col-6">Wachtwoord</label>
                        <label htmlFor="repeat_password" className="p-col-6">Herhaal Wachtwoord</label>
                        <div className="p-col-6">
                            <Password promptLabel={"Voer een wachtwoord in"}
                                      weakLabel={"Zwak"}
                                      strongLabel={"Sterk"}
                                      header={header}
                                      footer={footer}
                                      onInput={(input) => this.onChangePassword(input)}
                                      value={this.state.password}
                                      id="password" type="text"/>
                        </div>
                        <div className="p-col-6">
                            <Password
                                feedback={false}
                                onInput={(input) => this.onChangeSecondaryPassword(input)}
                                value={this.state.secondaryPassword}
                                id="repeat_password" type="text"/>
                        </div>
                        <div style={{textAlign: "center", marginTop: 3}} className={"p-col-12"}>
                            {this.state.secondaryPasswordMatches ? <span>&nbsp;</span> :
                                <span style={{color: "red"}}>Wachtwoorden komen niet overeen!</span>}
                        </div>
                    </div>

                    {this.props.error ? <span>{this.props.error}</span> :
                        <span>&nbsp; </span>}

                    <Button icon={this.props.loading ? "pi pi-spin pi-spinner" : "pi pi-check"} iconPos={"right"}
                            disabled={this.props.loading}
                            onClick={() => {
                                this.props.dispatch(register(this.state.firstname, this.state.lastname, this.state.password, this.state.email))
                            }} label={"Aanmelden"}/>

                    <Divider/>
                    <p style={{textAlign: "center"}}>Heeft u al een account?</p>
                    <Link to={"/account/login"}>
                        <Button className={"p-button-secondary"} label={"Inloggen"}/>
                    </Link>

                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loading: getAuthAuthenticating(state)}
}

export default connect(mapStateToProps)(Register);
