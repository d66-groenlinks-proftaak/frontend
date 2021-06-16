import {getAuthAuthenticated, getAuthId} from "../../../Core/Authentication/authentication.selectors";
import {getReplyOpen} from "../../../Core/Message/message.selectors";
import {getPermissions} from "../../../Core/Global/global.selectors";
import {connect} from "react-redux";
import {Card} from "primereact/card";
import {Link} from "react-router-dom";
import YouTube from "react-youtube";
import React, {useEffect, useState} from "react";
import {Button} from "primereact/button";

function Webinar(props){

    const [StreamId, setStreamId] = useState("");

    const opts = {
        height: 700,
        width: 1240,
        playerVars: {
            autoplay: 1,
            liveChat: 1
        },
    };

     const reactButton =() => {
            return <Button onClick={() => {
                props.togglePostWindow()
                props.setReplyingTo("", "")

            }} className={"p-button-primary p-button-outlined"} icon="pi pi-plus"
                           label={"Reageer"}
                           iconPos="right"/>;
    }

    useEffect( () => {
        let str = props.Content.split("<")

        let res;
        for (let i =0; i < str.length; i++){
            if(str[i].includes("https://www.youtube.com/watch?v=")){
                let test = str[i].split(">")
                for (let j = 0; j < test.length; j++){
                    if(test[j].includes("https://www.youtube.com/watch?v=")){
                        let s = test[j].split("https://www.youtube.com/watch?v=")
                        setStreamId(s[1])
                        return
                    }
                }
            }

        }
    },[])


    const _onReady =(event)=> {
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

            <YouTube videoId={StreamId} opts={opts} onReady={_onReady} />
            <div style={{display: "flex", justifyContent: "right"}}>
                <div style={{flexGrow: 1}}></div>
                <div>
                    {reactButton()}
                </div>
            </div>
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