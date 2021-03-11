import React from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {Sidebar} from "primereact/sidebar";
import {InputText} from "primereact/inputtext";
import {Editor} from "primereact/editor";
import LoadingMessage from "./LoadingMessage";

class Message extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            author: "",
            content: "",
            created: "",
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
            reportMessage: ""
        }
    }

    setPostWindow = (open) => {
        this.setState({
            newPostOpen: open
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

        this.props.connection.send("CreateReply", {
            Parent: this.props.id,
            Content: this.state.newPost.content,
            Email: this.state.newPost.email,
            Author: this.state.newPost.author,
        }).then(result => {
            this.setState({
                additionalProps: {}
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


    componentDidMount() {
        this.props.connection.on("SendThreadDetails", thread => {
            this.setState({
                author: thread.parent.author,
                content: thread.parent.content,
                created: thread.parent.created,
                id: thread.parent.id,
                title: thread.parent.title,
                replies: thread.children
            })
        })

        this.props.connection.on("SendChild", child => {
            const children = Object.assign([], this.state.replies);

            children.unshift(child)

            this.setState({replies: children});
        })

        this.props.connection.on("ConfirmReport", (ReportConfirmation) => {
            this.setState({reportConfirmation: ReportConfirmation})
            console.log("Test");
        })

        this.props.connection.send("LoadMessageThread", this.props.id);
    }

    render() {

        if (this.state.title === undefined) {
            return <LoadingMessage/>
        }

        return <div className={"p-mt-5"}>
            <div className="p-d-flex p-jc-between p-ai-center">
                <Link to={"/"}>
                    <Button className={"p-button-secondary"} label={"Terug"} style={{float: "right"}}
                            icon="pi pi-arrow-left" iconPos="left"/>
                </Link>
                <div>

                    <Button className={"p-button-secondary"} label={"Volg"} style={{float: "right"}} icon="pi pi-bell"
                            iconPos="right"/>
                </div>
            </div>

            <Card title={this.state.title} subTitle={<span><span
                style={{color: "blue"}}>@{this.state.author}</span> op {new Date(this.state.created).toLocaleString()}</span>}
                  className={"p-mt-5"}>
                <Button className={"p-button-secondary"} style={{float: "right"}} icon="pi pi-ban" iconPos="right"
                        onClick={() => this.setReportWindow(true)}/>
                <div dangerouslySetInnerHTML={{__html: this.state.content}}/>
            </Card>


            <div className="p-d-flex p-jc-between p-ai-center">
                <div>
                    <h1>Reacties</h1>
                </div>
                <div>
                    <Button onClick={() => {
                        this.setPostWindow(true)
                    }} className={"p-button-primary"} style={{float: "right"}} icon="pi pi-plus" iconPos="right"/>
                </div>
            </div>

            {this.state.replies.map(reply => {
                return <Card className={"p-mb-2"} subTitle={<span><span
                    style={{color: "blue"}}>@{reply.author}</span> op {new Date(reply.created).toLocaleString()}</span>}>
                    <div dangerouslySetInnerHTML={{__html: reply.content}}/>
                </Card>
            })}


            <div className={"p-grid"}>
                <Sidebar style={{overflowY: "scroll"}} className={"p-col-12 p-md-4"} position="right"
                         visible={this.state.newPostOpen} onHide={() => this.setPostWindow(false)}>
                    <div className="p-grid p-fluid p-p-3 p-pt-3">
                        <h1>Nieuwe Reactie Aanmaken</h1>

                        <div className="p-col-12">
                            <h3>Bericht</h3>
                            <Editor style={{height: '320px'}} value={this.state.newPost.content} onTextChange={(e) => {
                                this.onInputChanged("content", e.htmlValue)
                            }}/>

                            <h3>E-Mail</h3>
                            <InputText value={this.state.newPost.email} onChange={e => {
                                this.onInputChanged("email", e.target.value)
                            }}/>

                            <h3>Naam</h3>
                            <InputText value={this.state.newPost.author} onChange={e => {
                                this.onInputChanged("author", e.target.value)
                            }}/>
                        </div>

                        <div className={"p-col-12 p-md-6 p-mt-5"}>
                            <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => {
                                this.createPost()
                            }} label={"Plaatsen"}/>
                        </div>
                    </div>
                </Sidebar>
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

        </div>
    }
}

export default Message;
