import {connect} from "react-redux";
import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {Tag} from "primereact/tag";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faThumbtack} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {Tooltip} from "primereact/tooltip";
import React from "react";
import {Button} from "primereact/button";


const SendBan =(connection, postId, banned) =>{
    console.log(postId,banned)
    connection.send("UpdateBannedMessages", {
        PostId:postId,
        Banned: banned
    })
}

function ShadowBanMessage(props){
    return <div className={"message"} style={{width: "100%"}}>
        <div className={"p-d-flex p-jc-between p-ai-center"}>
            <div>
                <div className={"message-title"} style={{fontWeight: "bold", color: "black"}}>
                    {props.guest ? <Tag value="Gast" severity={"warning"}/> : ""} {props.title}
                </div>
            </div>
            <div>
                <div style={{color: "#ff5959"}}> {props.pinned ?
                    <FontAwesomeIcon icon={faThumbtack}/> : ""} </div>
            </div>
        </div>
        <div style={{fontSize: "0.7em", color: "black"}}>
            <Link className={"message-author"} to={"/profile/" + props.authorId}>@{props.author}</Link>
            <span
                className={"message-date"}
                data-pr-tooltip={DateTime.fromMillis(props.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}> — {DateTime.fromMillis(props.created).toRelative({locale: "nl"})} gepost</span>
        </div>
        <div className={"p-d-flex p-jc-between p-ai-end"}>
            <div style={{
                marginTop: 5,
                wordBreak: "break-all"
            }} className={"message-content"}>{props.children}</div>
            <div>
                <Button className={"p-button-outlined p-button-sm"} style={{margin: "3px"}} label={<i className={"pi pi-ban"} style={{'fontSize': '0.9em'}}
                         onClick={() => SendBan(props.connection, props.postId, true)}/>}></Button>
                <Button className={"p-button-outlined p-button-sm"} style={{margin: "3px"}} label={<i className={"pi pi-check"} style={{'fontSize': '0.9em'}}/>}
                         onClick={() => SendBan(props.connection, props.postId, false)}></Button>
            </div>
        </div>

        <Tooltip className={"tooltip"} target=".message-date" position={"bottom"}/>
    </div>
}

const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), connection: getGlobalConnection(state)}
}
export default connect(mapStateToProps)(ShadowBanMessage)