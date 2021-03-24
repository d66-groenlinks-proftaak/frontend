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
import Report from "./Report";
import {getAuthAuthenticated} from "../../../Core/Authentication/authentication.selectors";
import {connect} from "react-redux";
import {List, CellMeasurer, CellMeasurerCache, AutoSizer, WindowScroller} from "react-virtualized";


const TestList = [
    "Haha",
    "Haha2'"
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
            reportId: ""
        }

        this.listRef = React.createRef();

        this.menuRef = React.createRef();
        this._cache = new CellMeasurerCache({
            fixedWidth: true
        })

        this._rowRenderer.bind(this)
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
                }} level={level} content={reply.content} menuRef={this.menuRef}
                                       created={reply.created}
                                       id={reply.id}
                                       author={reply.author}
                                       authorId={reply.authorId}
                                       extraOptions={this.extraOptions}/>)

                if (reply.replyContent && reply.replyContent.length > 0) {
                    for (let r of this.GetRepliesDepth(level + 1, reply))
                        item.children.push(r)
                }

                replies.push(item)
            }

        return replies;
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

    GetReplies(level, message) {
        let replies = this.GetRepliesDepth(level, message);

        let cur = 0;
        let addToEnd = <span></span>
        return <div>
            {replies.map(reply => {
                cur++;

                let parent;

                for (let _reply of this.state.replies) {
                    if (_reply.id === reply.parent) {
                        parent = _reply;
                        break;
                    }
                }

                if (cur === replies.length && (replies.length < parent.replies)) {
                    if (this.state.displayMore[reply.parent] == true) {
                        addToEnd = <span></span>
                    }

                    addToEnd = <Button onClick={() => {
                        this.setState(state => {
                            const loadingMore = Object.assign({}, state.loadingMore);

                            loadingMore[reply.parent] = true;

                            return {loadingMore}
                        })


                        this.props.connection.send("LoadSubReplies", reply.id)
                    }} className={"p-button-text p-ml-5"} style={{width: "200px"}}
                                       icon={this.state.loadingMore[reply.parent] ? "pi pi-spin pi-spinner" : ""}
                                       iconPos="right"
                                       disabled={this.state.loadingMore[reply.parent]} label={"Meer Laden"}/>
                }

                return <div>
                    {reply.element}
                    {addToEnd}
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

    componentWillUnmount() {
        this.props.connection.off("SendThreadDetails");
        this.props.connection.off("SendChildren");
        this.props.connection.off("SendChild");
    }


    _rowRenderer = ({index, key, parent, style}) => {
        const reply = this.state.replies[index];

        return <CellMeasurer parent={parent} cache={this._cache} columnIndex={0} rowIndex={index} key={key}>
            {({measure, registerChild}) => {
                return <div style={{...style}}>
                    <Reply
                        setReportId={this.setReportId} setReplyingTo={(a, b) => {
                        this.setReplyingTo(a, b)
                    }} setPostWindow={(b) => {
                        this.setPostWindow(b)
                    }} content={reply.content} menuRef={this.menuRef} created={reply.created} id={reply.id}
                        author={reply.author}
                        authorId={reply.authorId}
                        extraOptions={this.extraOptions}/>

                    {this.GetReplies(1, reply)}
                </div>
            }}
        </CellMeasurer>
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

        this.props.connection.on("SendChildren", children => {
            const _children = Object.assign([], this.state.replies);
            const displayMore = Object.assign([], this.state.displayMore);
            const loadingMore = Object.assign([], this.state.loadingMore);

            console.log(children);

            for (let child of children) {
                if (this.GetParent(_children, child.parent).replyContent)
                    this.GetParent(_children, child.parent).replyContent.push(child);
                else
                    this.GetParent(_children, child.parent).replyContent = [child]
            }

            if (children.length > 3) {
                displayMore[children[0].parent] = false;
                loadingMore[children[0].parent] = false;
            } else {
                displayMore[children[0].parent] = true;
                loadingMore[children[0].parent] = true;
            }

            console.log(this.GetParent(_children, children[0].parent))

            this.setState({replies: _children, displayMore: displayMore, loadingMore: loadingMore}, () => {
                this._cache.clearAll()
                this.listRef.current.forceUpdateGrid()
            })
        })

        this.props.connection.on("SendChild", child => {
            const children = Object.assign([], this.state.replies);
            const displayMore = Object.assign({}, this.state.displayMore);
            const loadingMore = Object.assign({}, this.state.loadingMore);

            let parent;
            for (let _reply in children) {
                if (children[_reply].id === child.parent)
                    parent = _reply;
            }

            if (child.parent === this.props.id) {
                children.unshift(child);
            } else {
                if (this.GetParent(children, child.parent).replyContent) {
                    this.GetParent(children, child.parent).replyContent.unshift(child);

                    if (this.GetParent(children, child.parent).replyContent.length >= 4) {
                        displayMore[child.parent] = false;
                        loadingMore[child.parent] = false;
                        children[parent].replies += 1;
                        this.GetParent(children, child.parent).replyContent.pop();
                    }
                } else
                    this.GetParent(children, child.parent).replyContent = [child]
            }

            this.setState({replies: children, displayMore: displayMore, loadingMore: loadingMore}, () => {
                this._cache.clearAll()
                this.listRef.current.forceUpdateGrid()
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

        const threadStart = <Card title={this.state.title}
                                  subTitle={<span><Link to={"/profile/" + this.state.authorId}
                                                        style={{color: "blue"}}>@{this.state.author}</Link></span>}
                                  className={"p-mt-5 p-mb-5"}>
            <div style={{wordBreak: "break-all"}}
                 dangerouslySetInnerHTML={{__html: this.state.content}}/>
            <div className="p-d-flex p-jc-between p-ai-center">
                <div className={"message-posted"}
                     data-pr-tooltip={DateTime.fromMillis(this.state.created).setLocale("nl").toLocaleString(DateTime.DATETIME_FULL)}>
                    {DateTime.fromMillis(this.state.created).toRelative({locale: "nl"})}
                </div>
                <div>
                    <Menu ref={this.menuRef} popup model={this.extraOptions}/>

                    <Button className={"p-button-secondary p-mr-2 p-button-text"}
                            icon="pi pi-ellipsis-h"
                            iconPos="right"
                            onClick={(event) => {
                                this.menuRef.current.toggle(event)
                                this.setReportId(this.state.id)
                            }}/>

                    <Button onClick={() => {
                        this.togglePostWindow()
                        this.setState({
                            replyingTo: "",
                            replyingToId: ""
                        })
                    }} className={"p-button-primary p-button-outlined"} icon="pi pi-plus"
                            label={"Reageer"}
                            iconPos="right"/>
                </div>
            </div>
        </Card>

        return <div className={"p-mt-5"}>
            {header}


            {threadStart}

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
                    {({height, isScrolling, registerChild, onChildScroll, scrollTop}) => (
                        <AutoSizer disableHeight>
                            {({width}) => <List autoHeight
                                                isScrolling={isScrolling}
                                                onScroll={onChildScroll}
                                                overscanRowCount={2}
                                                scrollTop={scrollTop} ref={this.listRef}
                                                deferredMeasurementCache={this._cache}
                                                rowHeight={this._cache.rowHeight}
                                                autoHeight width={width} height={height}
                                                rowCount={this.state.replies.length}
                                                rowRenderer={this._rowRenderer}/>
                            }
                        </AutoSizer>
                    )}
                </WindowScroller>
            </div>
            <Tooltip className={"tooltip"} target=".message-posted" position={"bottom"}/>
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
