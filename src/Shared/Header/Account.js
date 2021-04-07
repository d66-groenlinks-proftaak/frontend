import React from "react";
import {Button} from "primereact/button";
import {Link, Redirect} from "react-router-dom";
import {Menu} from 'primereact/menu';
import {connect} from "react-redux";
import {getAuthAuthenticated, getAuthEmail, getAuthId} from "../../Core/Authentication/authentication.selectors";

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.menuRef = React.createRef();
        this.state = {
            redirect: false
        }
    }

    render() {
        const items = [
            {
                label: 'Account',
                items: [{
                    label: 'Profile', icon: 'pi pi-fw pi-user', command: () => {
                        this.setState({
                            redirect: "/profile/" + this.props.accountId
                        })
                    }
                },
                    {
                        label: 'Sign Out', icon: 'pi pi-fw pi-power-off', command: () => {
                            localStorage.clear();
                            window.location.href = "/";
                        }
                    }]
            },
            {
                label: 'Administratie',
                items: [{
                    label: 'Paneel', icon: 'pi pi-fw pi-cog', command: () => {
                        this.setState({
                            redirect: "/admin"
                        })
                    }
                }]
            }
        ]

        if (this.props.loggedIn) {
            if (this.state.redirect) {
                const redirect = this.state.redirect;
                this.setState({
                    redirect: false
                })
                return <Redirect to={redirect}/>
            }

            return <span>
                <Menu ref={this.menuRef} className={"dark"} popup model={items}/>
                <Button className={"p-button-text"} label={this.props.accountName}
                        onClick={(event) => this.menuRef.current.toggle(event)}/>
            </span>
        }

        return <span>
            <Link
                to={"/account/login"}><Button label={"Account"}/></Link>
        </span>
    }
}

const mapStateToProps = (state) => {
    return {loggedIn: getAuthAuthenticated(state), accountName: getAuthEmail(state), accountId: getAuthId(state)}
}

export default connect(mapStateToProps)(Account);
