import React from "react";
import {Card} from "primereact/card";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tag} from 'primereact/tag';
import {faThumbtack} from '@fortawesome/free-solid-svg-icons'

class Message extends React.Component {
    testPrint() {

    }

    render() {
        return <div className={"message"}>
            <div class={"p-d-flex p-jc-between p-ai-center"}>
                <div>
                    <div style={{fontWeight: "bold", color: "black"}}>
                        {this.props.guest ? <Tag value="Gast" severity={"warning"}/> : ""} {this.props.title}
                    </div>
                </div>
                <div>
                    <div style={{color: "#ff5959"}}> {this.props.pinned ?
                        <FontAwesomeIcon icon={faThumbtack}/> : ""} </div>
                </div>
            </div>
            <div style={{fontSize: "0.7em", color: "black"}}>
                <Link to={"/profile/" + this.props.authorId} style={{color: "blue"}}>@{this.props.author}</Link>
                <span> heeft gepost op {new Date(this.props.created).toLocaleString()}</span>
            </div>
            <div className={"p-d-flex p-jc-between p-ai-end"}>
                <div style={{
                    color: "gray",
                    marginTop: 5,
                    wordBreak: "break-all"
                }}>{this.props.children}</div>
                <div style={{
                    minWidth: 55,
                    textAlign: "right"
                }}>
                    <div style={{color: "black"}}> {this.props.replies || 0} <i className={"pi pi-comments"}/></div>
                </div>
            </div>
        </div>
    }
}

export default Message;
