import {getAuthAuthenticated, getAuthId} from "../../../Core/Authentication/authentication.selectors";
import {getReplyOpen} from "../../../Core/Message/message.selectors";
import {getPermissions} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {Card} from "primereact/card";
import {Link} from "react-router-dom";
import YouTube from "react-youtube";
import React, {useEffect} from "react";

function Webinar(props){

    console.log(document.getElementById("Message"))

    const opts = {
        height: document.getElementById("Message").clientHeight - 60,
        width: document.getElementById("Message").clientWidth - 60,
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
        },
    };

    const _onReady =(event)=> {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    return <div
        className={!props.isThread && props.level > 0 ? "post-child" : ""}
        id={"Card"}
        style={!props.isThread ? {
            paddingLeft: (props.level) * 30,
            margin: 0,
            paddingTop: 10
        } : {paddingTop: 10}}>

        <Card title={ props.title }
              subTitle={<span><Link to={"/profile/" + props.authorId}
                                    style={{color: "blue"}}>@{props.author}</Link></span>}
              className={(!props.isThread && props.level > 0 ? "" : "post-parent") + props.isThread ?  + "p-mt-5 p-mb-5" : ""}>

            <YouTube videoId="5qap5aO4i9A" opts={opts} onReady={_onReady} />
        </Card>

    </div>
}


const
    mapStateToProps = (state) => {
        return {loggedIn: getAuthAuthenticated(state), replyOpen: getReplyOpen(state),permissions: getPermissions(state),accountId: getAuthId(state) }
    }

export default connect(mapStateToProps)

(
    Webinar
)
;