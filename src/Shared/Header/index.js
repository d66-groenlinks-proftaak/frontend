import React from "react";
import {Link} from "react-router-dom";
import Account from "./Account";
import {InputText} from "primereact/inputtext";
import {faSun} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {connect} from "react-redux";
import {getDarkMode} from "../../Core/Global/global.selectors";
import {setDarkMode} from "../../Core/Global/global.actions";
import Logo from "./D66GL.png";

class index extends React.Component {
    render() {
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
                      className={"p-text-bold brand"}>
                          <img src={Logo} alt=""/>
                      </Link>

                <div>
                    <InputText className={"search-bar hidden-sm hidden-xs"} placeholder={"Zoeken"}/>

                    <Account accountId={this.props.accountId}
                             accountName={this.props.accountName}
                             loggedIn={this.props.loggedIn}/>

                    <span onClick={() => this.props.dispatch(setDarkMode(!this.props.darkmode))}
                          className={"darkmode-toggle"}
                          style={{paddingLeft: 10, fontSize: "1.2em"}}>
                        <FontAwesomeIcon icon={faSun}/>
                    </span>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {darkmode: getDarkMode(state)}
}

export default connect(mapStateToProps)(index);
