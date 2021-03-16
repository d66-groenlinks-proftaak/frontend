import React from "react";
import {Menubar} from 'primereact/menubar';
import {Link} from "react-router-dom";
import Account from "./Account";
import {InputText} from "primereact/inputtext";
import {faSun} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class index extends React.Component {
    render() {
        const menuItems = []

        return <div className={"p-grid p-justify-center p-nogutter p-pl-2 p-pr-2 header"}
                    style={{
                        borderBottom: "1px solid #dee2e6",
                        width: "100%",
                        overflow: "hidden"
                    }}>
            <div
                className={"p-col-12 p-md-8 p-xl-8 p-d-flex p-jc-between p-ai-center p-pt-2 p-pb-2"}>
                <Link to={"/"} style={{
                    fontSize: "1.7em",
                    textDecoration: 'none'
                }}
                      className={"p-text-bold brand"}>Ringkey</Link>

                <div>
                    <InputText className={"search-bar hidden-sm hidden-xs"} placeholder={"Zoeken"}/>

                    <Account accountId={this.props.accountId}
                             accountName={this.props.accountName}
                             loggedIn={this.props.loggedIn}/>

                    <span onClick={this.props.toggleDarkMode} className={"darkmode-toggle"} style={{fontSize: "1.2em"}}>
                        <FontAwesomeIcon icon={faSun}></FontAwesomeIcon>
                    </span>
                </div>
            </div>
        </div>
    }
}

export default index;
