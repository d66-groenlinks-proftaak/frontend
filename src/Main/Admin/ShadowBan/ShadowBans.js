import ShadowBanMessage from "./ShadowBanMessage";
import React, {useEffect, useState} from "react";
import {getAuthAuthenticating, getAuthError} from "../../../Core/Authentication/authentication.selectors";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import Message from "../../Home/Messages/Message";


function ShadowBans(props){
    const [messageList, setMessageList] = useState();

    useEffect(() =>{
        props.connection.send("GetShadowBannedMessages")
        props.connection.on("SendShadowBannedMessages", message =>{
            if(messageList === undefined){
                setMessageList(message)
            }
        })

    },[messageList])


    return <div style={{width: "100%"}} className={"p-d-flex p-jc-center p-ai-center"}>
        <div style={{width: "40%"}}>
            <h1 style={{textAlign: "center"}}>Gerapporteerde berichten</h1>
            <h4 style={{textAlign: "center"}}><i className={"pi pi-ban"}/> : verwijdert dit bericht <i className={"pi pi-check"}/> : behoudt dit bericht</h4>
            {messageList !== undefined ? messageList.map(message => {
                return <ShadowBanMessage style={{width: "100%"}} guest={message.guest}
                                         replies={message.replies}
                                         pinned={message.pinned}
                                         title={message.title}
                                         authorId={message.authorId}
                                         author={message.author}
                                         created={message.created}
                                         postId={message.id}>
                    {message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}
                </ShadowBanMessage>
            }) : <span/>}
        </div>

    </div>
}
const mapStateToProps = (state) => {
    return {error: getAuthError(state), loggingIn: getAuthAuthenticating(state), connection: getGlobalConnection(state)}
}
export default connect(mapStateToProps)(ShadowBans)