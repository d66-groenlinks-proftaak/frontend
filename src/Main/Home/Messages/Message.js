import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tag} from 'primereact/tag';
import {faThumbtack} from '@fortawesome/free-solid-svg-icons'
import {DateTime} from "luxon";
import {Tooltip} from "primereact/tooltip";

class Message extends React.Component {
    testPrint() {

    }

    render() {
        return <div className={"message"}>
            <div class={"p-d-flex p-jc-between p-ai-center"}>
                <div>
                    <div className={"message-title"} style={{fontWeight: "bold", color: "black"}}>
                        {this.props.guest ? <Tag value="Gast" severity={"warning"}/> : ""} {this.props.title}
                    </div>
                </div>
                <div>
                    <div style={{color: "#ff5959"}}> {this.props.pinned ?
                        <FontAwesomeIcon icon={faThumbtack}/> : ""} </div>
                </div>
            </div>
            <div style={{fontSize: "0.7em", color: "black"}}>
                <Link className={"message-author"} to={"/profile/" + this.props.authorId}>@{this.props.author}</Link>
                <span
                    className={"message-date"}
                    data-pr-tooltip={DateTime.fromMillis(this.props.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}> — {DateTime.fromMillis(this.props.created).toRelative({locale: "nl"})} gepost</span>
            </div>
            <div className={"p-d-flex p-jc-between p-ai-end"}>
                <div style={{
                    marginTop: 5,
                    wordBreak: "break-all"
                }} className={"message-content"}>{this.props.children}</div>
                <div style={{
                    minWidth: 55,
                    textAlign: "right"
                }}>
                    <div className={"message-comments"}> {this.props.replies || 0} <i className={"pi pi-comments"}/>
                    </div>
                </div>
            </div>

            <Tooltip className={"tooltip"} target=".message-date" position={"bottom"}/>
        </div>
    }
}

export default Message;
