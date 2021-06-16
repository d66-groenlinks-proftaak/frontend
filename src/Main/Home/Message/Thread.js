import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {Card} from "primereact/card";
import React from "react";

export default function Thread(props) {
    function reactButton() {
        if(props.locked === false){
            return <Button onClick={() => {
                if (props.isThread) {
                    props.togglePostWindow()
                    props.setReplyingTo("", "")
                }
                else {
                    props.setPostWindow(true)
                    props.setReplyingTo(props.author, props.id)
                }
            }} className={"p-button-primary p-button-outlined"} icon="pi pi-plus"
                    label={props.isThread ? "Reageer" : "Citeer"}
                    iconPos="right"/>;
        }
    }
    return <div
    className={!props.isThread && props.level > 0 ? "post-child" : ""}
    style={!props.isThread ? {
        paddingLeft: (props.level) * 30,
        margin: 0,
        paddingTop: 10
    } : {paddingTop: 10}}>
    <Card title={ props.isThread ? props.title : "" }
                 subTitle={<span><Link to={"/profile/" + props.authorId}
                                       style={{color: "blue"}}>@{props.author}</Link></span>}
                 class={(!props.isThread && props.level > 0 ? "" : "post-parent") + props.isThread ?  + "p-mt-5 p-mb-5" : ""}>
        <div style={{wordBreak: "break-all"}}
             dangerouslySetInnerHTML={{__html: props.content}}/>
        <div className="p-d-flex p-jc-between p-ai-center">
            <div className={"message-posted"}
                 data-pr-tooltip={DateTime.fromMillis(props.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}>
                {DateTime.fromMillis(props.created).toRelative({locale: "nl"})}
            </div>
            <div>
                <Button className={"p-button-secondary p-mr-2 p-button-text"}
                        icon="pi pi-ellipsis-h"
                        iconPos="right"
                        onClick={(event) => {
                            if (props.menuRef.current)
                                props.menuRef.current.toggle(event)
                            props.setReportId(props.id)
                        }}/>

                        {reactButton()}
            </div>
        </div>

        {props.isThread && props.attachments.length > 0 ? <div>
            <Divider/>
            <h3>Bijvoegingen</h3>

            <div className="p-grid">
                {props.attachments.map(attachment => {
                    return <div className="p-col-4" style={{position: "relative", marginBottom: 5}}>
                        <div style={{paddingBottom: 20}}>
                            <img onClick={() => {
                                props.showAttachment(`http://localhost:5000/images/${attachment.id}_${attachment.name}`)
                            }} src={`http://localhost:5000/images/${attachment.id}_${attachment.name}`}
                                 alt="Attachment" style={{maxWidth: "100%", maxHeight: 300}}/>
                        </div>
                    </div>
                })}
            </div>
        </div> : ""}
    </Card>
    </div>
}
