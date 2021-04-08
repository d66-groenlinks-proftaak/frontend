import {Link} from "react-router-dom";
import {DateTime} from "luxon";
import {Menu} from "primereact/menu";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import {Card} from "primereact/card";
import React from "react";

export default function Thread(props) {
    function Greeting() {
        if(props.locked == false)
          return <Button onClick={() => {
            props.togglePostWindow()
            props.setReplyingTo("", "")
        }} className={"p-button-primary p-button-outlined"} icon="pi pi-plus"
                label={"Reageer"}
                iconPos="right"/>;
      }
      
    return <Card title={props.title}
                 subTitle={<span><Link to={"/profile/" + props.authorId}
                                       style={{color: "blue"}}>@{props.author}</Link></span>}
                 className={"p-mt-5 p-mb-5"}>
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
                            //props.setReportId(props.id)
                        }}/>
                
                {Greeting()}
            </div>
        </div>

        {props.attachments.length > 0 ? <div>
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
                        <div style={{position: "absolute", bottom: 0}}>
                            {attachment.name}
                        </div>
                    </div>
                })}
            </div>
        </div> : ""}
    </Card>
}
