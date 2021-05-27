import React from "react";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {Tag} from 'primereact/tag';
import {faThumbtack} from '@fortawesome/free-solid-svg-icons'
import {DateTime} from "luxon";
import {Tooltip} from "primereact/tooltip";

class Message extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: true
        }
        this.toggleHover = this.toggleHover.bind(this) 
        this.SetHoverFalse = this.SetHoverFalse.bind(this) 
        this.SetHoverTrue = this.SetHoverTrue.bind(this) 

    }

    SetHoverFalse(){
        this.setState({hover: false})
    }

    SetHoverTrue(){
        this.setState({hover: true})
    }

    toggleHover() {
        this.setState({hover: !this.state.hover})
    }



    render() {
        return <div onMouseEnter={this.SetHoverFalse} onMouseLeave={this.SetHoverTrue} >
                <div className={" message p-component"} >
                    <div  className={this.props.style}></div>
                    <div  className={"content"}>
                        <div class={"p-d-flex p-jc-between p-ai-center"}>
                            <div>
                                <div className={"message-title"} style={{ fontSize: this.props.titleSize, fontWeight: "bold", color: "black"}}>

                                <Tag value={this.props.role} severity={""}/> {this.props.title}
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
                            }} className={"message-content"}>{this.props.content}</div>
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
            </div>
            <div style={{position: "relative", width: "calc(100% + 50px)", marginLeft: "-25px"}}>
                <div hidden={this.state.hover} style={{position: "absolute", width: "100%"}}>
                    <div >
                        
                            {this.props.replyContent.map(m=> {
                                return <div className={" message p-component"} style={{ marginBottom: "4px", marginTop: "4px", paddingBottom: "10px", zIndex: "13", width: "100%" } }>
                                            <Link className={"message-author"} style={{ paddingLeft: "10px"}} to={"/profile/" + m.author}>@{m.author}</Link>
                                            <span
                                            className={"message-date"}
                                            data-pr-tooltip={DateTime.fromMillis(this.props.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}> — {DateTime.fromMillis(this.props.created).toRelative({locale: "nl"})} gepost</span>
                                            <div style={{ paddingLeft: "10px"}} className={"message-title"} 
                                            dangerouslySetInnerHTML={{__html: m.content}}/> <div/>
                                    </div>
                            })} 
                    </div>            
                </div>
            </div>
        </div>
    }
}

export default Message;
