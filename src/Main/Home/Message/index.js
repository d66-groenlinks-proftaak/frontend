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
import {DateTime} from "luxon"
import {Dialog} from 'primereact/dialog';
import {Tooltip} from 'primereact/tooltip';
import {ScrollTop} from 'primereact/scrolltop';
import Reply from "./Replies/Reply";
import Report from "./Report";
import {getAuthAuthenticated} from "../../../Core/Authentication/authentication.selectors";
import {connect} from "react-redux";
import {List, CellMeasurer, CellMeasurerCache, AutoSizer, WindowScroller} from "react-virtualized";
import Replies from "./Replies";
import Thread from "./Thread";

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
            repliesStr: ["test", "test2"],
            newPostOpen: false,
            additionalProps: {},
            newPost: {
                content: "",
                email: "",
                author: ""
            },
            newReportOpen: false,
            reportConfirmation: false,
            activeIndex: false,
            replyingTo: "",
            replyingToId: "",
            loadingMore: {},
            displayMore: {},
            reportId: "",
            attachments: [],
            showAttachment: false,
            attachment: ""
        }

        this.listRef = React.createRef();

        this.menuRef = React.createRef();
        this._cache = new CellMeasurerCache({
            fixedWidth: true
        })
    }

    extraOptions = [{
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

    showAttachment(bool, url) {
        this.setState({
            showAttachment: bool,
            attachment: url
        })
    }

    setPostWindow = (open) => {
        this.setState(_ => {
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
        }).then(_ => {
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

    setReportId = (id) => {
        this.setState({
            reportId: id
        })
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

    componentWillUnmount() {
        this.props.connection.off("SendThreadDetails");
    }

    componentDidMount() {
        this.props.connection.on("SendThreadDetails", thread => {
            this.setState({
                author: thread.parent.author,
                content: thread.parent.content,
                created: thread.parent.created,
                id: thread.parent.id,
                title: thread.parent.title,
                authorId: thread.parent.authorId,
                attachments: thread.parent.attachments || [],
                replies: thread.children
            })
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

    onHide = () => {
        this.setState({
            showAttachment: false
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
                <Button className={"p-button-info p-button-outlined"} label={"Terug"}
                        style={{float: "right"}}
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
            <Menu ref={this.menuRef} popup model={this.extraOptions}/>

            {header}

            <Thread togglePostWindow={this.togglePostWindow} attachments={this.state.attachments}
                    showAttachment={(a) => {
                        this.showAttachment(true, a)
                    }} id={this.state.id}
                    created={this.state.created}
                    title={this.state.title} menuRef={this.menuRef}
                    setReplyingTo={this.setReplyingTo}
                    author={this.state.author} authorId={this.state.authorId} content={this.state.content}/>

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

            <div className={"p-grid p-nogutter"}>
                <Sidebar className={"p-col-12 new-post p-grid p-justify-center p-nogutter"}
                         style={{overflowY: "scroll", overflowX: "hidden", width: "100%"}}
                         position="bottom"
                         showCloseIcon={false}
                         visible={this.state.activeIndex} onHide={() => this.setPostWindow(false)}>
                    <div className="new-post-content p-p-3 p-pt-3">
                        <div style={{color: "red"}}>{this.state.invalidTitle ? this.state.invalidTitle :
                            <span>&nbsp;</span>}</div>

                        {this.state.replyingTo !== "" ?
                            <span><b>Reageren op:</b> {this.state.replyingTo}</span> : ""}

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

            <Sidebar visible={this.state.newReportOpen} style={{overflowY: "scroll"}}
                     className={"p-col-12 p-md-4"}
                     onHide={() => this.props.setReportWindow(false)} position="right">
                <Report id={this.state.reportId} connection={this.props.connection}
                        setReportWindow={this.setReportWindow}/>
            </Sidebar>

            <div>
                <WindowScroller scrollElement={window}>
                    {({height, isScrolling, onChildScroll, scrollTop}) => (
                        <Replies setPostWindow={this.setPostWindow} menuRef={this.menuRef}
                                 setReportId={this.setReportId}
                                 setReplyingTo={this.setReplyingTo}
                                 replies={this.state.replies}
                                 connection={this.props.connection} height={height}
                                 isScrolling={isScrolling}
                                 onChilScroll={onChildScroll}
                                 scrollTop={scrollTop}/>
                    )}
                </WindowScroller>
            </div>

            <Dialog breakpoints={{'960px': '75vw', '640px': '100vw'}} dismissableMask={true} keepInViewport={true}
                    header="Bijlage" visible={this.state.showAttachment} onHide={() => {
                this.onHide();
            }}>
                <img src={this.state.attachment} alt="Bijlage" style={{width: "100%", maxHeight: "100%"}}/>
            </Dialog>

            <Tooltip className={"tooltip"} target=".message-posted" position={"bottom"}/>
            <ScrollTop/>
        </div>
    }
}

const
    mapStateToProps = (state) => {
        return {loggedIn: getAuthAuthenticated(state)}
    }

export default connect(mapStateToProps)

(
    Message
)
;
