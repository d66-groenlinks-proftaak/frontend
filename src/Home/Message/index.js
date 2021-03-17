import React from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {Sidebar} from "primereact/sidebar";
import {InputText} from "primereact/inputtext";
import {Editor} from "primereact/editor";
import LoadingMessage from "./LoadingMessage";
import {Menu} from "primereact/menu";
import {Divider} from "primereact/divider";
import {Accordion, AccordionTab} from "primereact/accordion";
import {DateTime} from "luxon"
import {Tooltip} from 'primereact/tooltip';
import Reply from "./Reply";

const extraOptions = [{
    label: "Rapporteer",
    icon: "pi pi-ban",
    command: () => {
        this.setReportWindow(true);
    }
},
    {
        label: "Bewerken",
        icon: "pi pi-pencil",
        command: () => {
        }
    }
]

class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            author: "",
            content: "",
            created: "",
            authorId: "",
            id: "",
            title: "",
            replies: [],
            newPostOpen: false,
            additionalProps: {},
            newPost: {
                content: "",
                email: "",
                author: ""
            },
            newReportOpen: false,
            reportConfirmation: false,
            reportMessage: "",
            activeIndex: false,
            replyingTo: "",
            replyingToId: ""
        }

        this.menuRef = React.createRef();
    }

    setPostWindow = (open) => {
        this.setState(state => {
            return {activeIndex: open}
        });
    }

    togglePostWindow = () => {
        this.setState(state => {
            return {activeIndex: !state.activeIndex}
        });
    }

    setReportWindow = (open) => {
        this.setState({
            newReportOpen: open
        });
    }

    onInputChanged = (type, content) => {
        this.setState(oldState => {
            const newPost = oldState.newPost;
            newPost[type] = content;

            return {newPost}
        })
    }

    createPost() {
        this.setState({
            additionalProps: {
                disabled: true,
                icon: "pi pi-spin pi-spinner"
            }
        })

        let parent = this.props.id;

        if (this.state.replyingToId !== "")
            parent = this.state.replyingToId;

        this.props.connection.send("CreateReply", {
            Parent: parent,
            Content: this.state.newPost.content,
            Email: this.state.newPost.email,
            Author: this.state.newPost.author,
        }).then(result => {
            this.setState({
                additionalProps: {},
                newPost: {
                    content: "",
                    email: "",
                    author: ""
                }
            })

            this.setPostWindow(false);
        })
            .catch(e => {
                this.setState({
                    additionalProps: {}
                })

                alert(e.message);
            })
    }

    SendReport() {
        this.props.connection.send("ReportMessage", {
            ReportMessage: this.state.ReportMessage
        })
        this.setReportWindow(false)
    }

    GetRepliesDepth(level, message) {
        let replies = [];

        if (message.replyContent)
            for (let reply of message.replyContent) {
                let item = {
                    parent: message.id,
                    id: reply.id,
                    children: [],
                    created: reply.created
                }

                item.element = (<Reply setReplyingTo={(a, b) => {
                    this.setReplyingTo(a, b)
                }} setPostWindow={(b) => {
                    this.setPostWindow(b)
                }} level={level} content={reply.content} menuRef={this.menuRef} created={reply.created}
                                       id={reply.id}
                                       author={reply.author}
                                       authorId={reply.authorId}
                                       extraOptions={extraOptions}/>)

                if (reply.replyContent && reply.replyContent.length > 0) {
                    for (let r of this.GetRepliesDepth(level + 1, reply))
                        item.children.push(r)
                }

                replies.push(item)
            }

        return replies;
    }

    GetSubReplies(reply) {
        if (reply.children && reply.children.length > 0) {
            return reply.children.map(_reply => {
                return <div>
                    {_reply.element}
                    {this.GetSubReplies(_reply)}
                </div>;
            })
        }
    }

    GetReplies(level, message) {
        let replies = this.GetRepliesDepth(level, message);

        return <div>
            {replies.map(reply => {
                return <div>
                    {reply.element}
                    {this.GetSubReplies(reply)}
                </div>;
            })}
        </div>
    }

    GetParent(replies, id) {
        for (let reply of replies)
            if (reply.id === id)
                return reply;

        for (let reply of replies)
            if (reply.replyContent && reply.replyContent.length > 0) {
                let rValue = this.GetParent(reply.replyContent, id);
                if (rValue)
                    return rValue;
            }
    }

    componentDidMount() {
        this.props.connection.on("SendThreadDetails", thread => {
            setTimeout(() => {
                this.setState({
                    author: thread.parent.author,
                    content: thread.parent.content,
                    created: thread.parent.created,
                    id: thread.parent.id,
                    title: thread.parent.title,
                    authorId: thread.parent.authorId,
                    replies: thread.children
                })
            }, 500);
        })

        this.props.connection.on("SendChild", child => {
            const children = Object.assign([], this.state.replies);

            console.log(child)

            if (child.parent === this.props.id)
                children.unshift(child);
            else {
                if (this.GetParent(children, child.parent).replyContent)
                    this.GetParent(children, child.parent).replyContent.unshift(child);
                else
                    this.GetParent(children, child.parent).replyContent = [child]
            }

            this.setState({replies: children})
        })

        this.props.connection.on("ConfirmReport", (ReportConfirmation) => {
            this.setState({reportConfirmation: ReportConfirmation})
        })

        this.props.connection.send("LoadMessageThread", this.props.id);
    }

    setReplyingTo = (author, id) => {
        this.setState({
            replyingTo: author,
            replyingToId: id
        })
    }

    render() {
        let authenticated = <div>
            <h3>E-Mail</h3>
            <InputText value={this.state.newPost.email} onChange={e => {
                this.onInputChanged("email", e.target.value)
            }}/>

            <h3>Naam</h3>
            <InputText value={this.state.newPost.author} onChange={e => {
                this.onInputChanged("author", e.target.value)
            }}/>
        </div>

        if (this.props.loggedIn)
            authenticated = "";

        let header = <div className="p-d-flex p-jc-between p-ai-center">
            <Link to={"/"}>
                <Button className={"p-button-info p-button-outlined"} label={"Terug"} style={{float: "right"}}
                        icon="pi pi-arrow-left" iconPos="left"/>
            </Link>
            <div>

                <Button className={"p-button-text"} style={{float: "right", color: "#CA8136"}}
                        icon="pi pi-bell"
                        iconPos="right"/>
            </div>
        </div>

        if (this.state.title === "") {
            return <div className={"p-mt-5"}>
                {header}
                <LoadingMessage/>
            </div>
        }

        return <div className={"p-mt-5"}>
            {header}
            <Card title={this.state.title} subTitle={<span><Link to={"/profile/" + this.state.authorId}
                                                                 style={{color: "blue"}}>@{this.state.author}</Link></span>}
                  className={"p-mt-5 p-mb-5"}>
                <div style={{wordBreak: "break-all"}} dangerouslySetInnerHTML={{__html: this.state.content}}/>
                <div className="p-d-flex p-jc-between p-ai-center">
                    <div className={"message-posted"}
                         data-pr-tooltip={DateTime.fromMillis(this.state.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}>
                        {DateTime.fromMillis(this.state.created).toRelative({locale: "nl"})}
                    </div>
                    <div>
                        <Menu ref={this.menuRef} popup model={extraOptions}/>

                        <Button className={"p-button-secondary p-mr-2 p-button-text"} icon="pi pi-ellipsis-h"
                                iconPos="right"
                                onClick={(event) => this.menuRef.current.toggle(event)}/>

                        <Button onClick={() => {
                            this.togglePostWindow()
                            this.setState({
                                replyingTo: "",
                                replyingToId: ""
                            })
                        }} className={"p-button-primary p-button-outlined"} icon="pi pi-plus" label={"Reageer"}
                                iconPos="right"/>
                    </div>
                </div>
            </Card>

            <Divider align="left">
            <span className="p-tag"
                  style={{
                      backgroundColor: "transparent",
                      border: "1px solid #dee2e6",
                      color: "#49506c",
                      fontSize: "1.2em",
                      fontWeight: "normal"
                  }}>Reacties</span>
            </Divider>

            <div className={"p-grid"}>
                <Sidebar className={"p-col-12 new-post p-grid p-justify-center p-nogutter"}
                         style={{overflowY: "scroll", overflowX: "hidden", width: "100%"}}
                         position="bottom"
                         showCloseIcon={false}
                         visible={this.state.activeIndex} onHide={() => this.setPostWindow(false)}>
                    <div className="new-post-content p-p-3 p-pt-3">
                        <div style={{color: "red"}}>{this.state.invalidTitle ? this.state.invalidTitle :
                            <span>&nbsp;</span>}</div>

                        {this.state.replyingTo !== "" ? <span><b>Reageren op:</b> {this.state.replyingTo}</span> : ""}

                        <Editor placeholder={"Typ hier uw reactie"} modules={{
                            toolbar: [[{'header': 1}, {'header': 2}], ['bold', 'italic'], ['link', 'blockquote']]
                        }} className={this.state.invalidTitle ? "p-invalid" : ""}
                                style={{height: '250px'}}
                                value={this.state.newPost.content} onTextChange={(e) => {
                            this.onInputChanged("content", e.htmlValue)
                        }}/>
                        <div style={{color: "red"}}>{this.state.invalidContent ? this.state.invalidContent :
                            <span>&nbsp;</span>}</div>


                        {authenticated}
                        <div>
                            <Button {...this.state.additionalProps} iconPos={"left"} icon={"pi pi-plus"}
                                    onClick={() => {
                                        this.createPost()
                                    }} label={"Plaatsen"}/>
                            <Button {...this.state.additionalProps}
                                    className={"p-button-secondary p-button-outlined p-ml-3"}
                                    iconPos={"right"}
                                    onClick={() => {
                                        this.setPostWindow(false)
                                    }} label={"Annuleren"}/>
                        </div>
                    </div>
                </Sidebar>
            </div>

            <div style={{paddingBottom: 20}}>
                {this.state.replies.map(reply => {
                    return <div><Reply setReplyingTo={(a, b) => {
                        this.setReplyingTo(a, b)
                    }} setPostWindow={(b) => {
                        this.setPostWindow(b)
                    }} content={reply.content} menuRef={this.menuRef} created={reply.created} id={reply.id}
                                       author={reply.author}
                                       authorId={reply.authorId}
                                       extraOptions={extraOptions}/>

                        {this.GetReplies(1, reply)}
                    </div>
                })}
            </div>

            <div className={"p-grid"}>
                <Sidebar style={{overflowY: "scroll"}} className={"p-col-12 p-md-4"} position="right"
                         visible={this.state.newReportOpen} onHide={() => this.setReportWindow(false)}>
                    <div className="p-grid p-fluid p-p-3 p-pt-3">
                        <h1>Report</h1>

                        <div className="p-col-12">
                            <h3>Bericht</h3>
                            <Editor style={{height: '320px'}} value={this.state.ReportMessage} onTextChange={(e) => {
                                this.onInputChanged("content", e.htmlValue)
                            }}/>
                        </div>

                        <div className={"p-col-12 p-md-6 p-mt-5"}>
                            <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => {
                                this.SendReport()
                            }} label={"Sturen"}/>
                        </div>
                    </div>
                </Sidebar>
            </div>


            <Tooltip className={"tooltip"} target=".message-posted" position={"bottom"}/>
        </div>
    }
}

export default Message;
