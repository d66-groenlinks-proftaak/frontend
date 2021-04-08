import React, {useEffect, useState} from "react";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Link} from "react-router-dom";
import {Sidebar} from "primereact/sidebar";
import {InputText} from "primereact/inputtext";
import {Editor} from "primereact/editor";
import LoadingMessage from "./LoadingMessage";
import {Menu} from "primereact/menu";
import {Divider} from "primereact/divider";
import {Dialog} from 'primereact/dialog';
import {Tooltip} from 'primereact/tooltip';
import {ScrollTop} from 'primereact/scrolltop';
import Report from "./Report";
import {getAuthAuthenticated} from "../../../Core/Authentication/authentication.selectors";
import {connect} from "react-redux";
import {WindowScroller} from "react-virtualized";
import Replies from "./Replies";
import Thread from "./Thread";

function Message(props) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [created, setCreated] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [id, setId] = useState("");
    const [title, setTitle] = useState("");
    const [locked, setLocked] = useState(false);
    const [replies, setReplies] = useState([]);
    const [newPostOpen, setNewPostOpen] = useState(false);
    const [additionalProps, setAdditionalProps] = useState({});
    const [newPost, setNewPost] = useState({
        content: "",
        email: "",
        author: ""
    });
    const [newReportOpen, setNewReportOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(false);
    const [replyingTo, setReplyingToState] = useState("");
    const [replyingToId, setReplyingToId] = useState("");
    const [reportId, setReportId] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [showAttachmentState, setShowAttachment] = useState(false);
    const [attachment, setAttachment] = useState("");

    const menuRef = React.createRef();

    const extraOptions = [{
        label: "Rapporteer",
        icon: "pi pi-ban",
        command: () => {
            setReportWindow(true);
        }
    },
        {
            label: "Bewerken",
            icon: "pi pi-pencil",
            command: () => {
            }
        },
        {
            label: "Lock",
            icon: "pi pi-lock",
            command: () => {
                props.connection.send("LockPost", props.id);
            }
        },
        {
            label: "Pin",
            icon: "pi pi-lock",
            command: () => {
                props.connection.send("TogglePostPin", props.id);
            }
        }
    ]

    const showAttachment = (bool, url) => {
        setShowAttachment(bool);
        setAttachment(url)
    }

    const setPostWindow = (open) => {
        setActiveIndex(open);
    }

    const togglePostWindow = () => {
        setActiveIndex(!activeIndex);
    }

    const setReportWindow = (open) => {
        setNewReportOpen(open);
    }

    const onInputChanged = (type, content) => {
        setNewPost(oldState => {
            const newPost = oldState;
            newPost[type] = content;

            return {newPost}
        })
    }

    const createPost = () => {
        setAdditionalProps({
            disabled: true,
            icon: "pi pi-spin pi-spinner"
        })

        let parent = props.id;

        if (replyingToId !== "")
            parent = replyingToId;

        props.connection.send("CreateReply", {
            Parent: parent,
            Content: newPost.content,
            Email: newPost.email,
            Author: newPost.author,
        }).then(_ => {
            setAdditionalProps({});
            setNewPost({
                content: "",
                email: "",
                author: ""
            });

            setPostWindow(false);
        })
            .catch(e => {
                setAdditionalProps({})

                alert(e.message);
            })
    }

    const GetSubReplies = (reply) => {
        if (reply.children && reply.children.length > 0) {
            return reply.children.map(_reply => {
                return <div>
                    {_reply.element}
                    {GetSubReplies(_reply)}
                </div>;
            })
        }
    }

    const setReplyingTo = (author, id) => {
        setReplyingToId(id);
        setReplyingToState(author);
    }

    const onHide = () => {
        setShowAttachment(false);
    }

    useEffect(() => {
        props.connection.on("SendThreadDetails", thread => {
            setAuthor(thread.parent.author);
            setContent(thread.parent.content);
            setCreated(thread.parent.created);
            setId(thread.parent.id);
            setTitle(thread.parent.title);
            setAuthorId(thread.parent.authorId);
            setAttachments(thread.parent.attachments || []);
            setReplies(thread.children);
            setLocked(thread.parent.locked);
        })

        props.connection.send("LoadMessageThread", props.id);

        return function cleanup() {
            props.connection.off("SendThreadDetails");
        }
    }, [])

    let authenticated = <div>
        <h3>E-Mail</h3>
        <InputText value={newPost.email} onChange={e => {
            onInputChanged("email", e.target.value)
        }}/>

        <h3>Naam</h3>
        <InputText value={newPost.author} onChange={e => {
            onInputChanged("author", e.target.value)
        }}/>
    </div>

    if (props.loggedIn)
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

    if (title === "") {
        return <div className={"p-mt-5"}>
            {header}
            <LoadingMessage/>
        </div>
    }

    return <div className={"p-mt-5"}>
        <Menu ref={menuRef} popup model={extraOptions}/>

        {header}

        <Thread togglePostWindow={togglePostWindow} attachments={attachments}
                showAttachment={(a) => {
                    showAttachment(true, a)
                }} id={id}
                created={created}
                title={title} menuRef={menuRef}
                setReplyingTo={setReplyingTo}
                author={author} authorId={authorId} content={content} 
                locked={locked}/>

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
                     visible={activeIndex} onHide={() => setPostWindow(false)}>
                <div className="new-post-content p-p-3 p-pt-3">

                    {replyingTo !== "" ?
                        <span><b>Reageren op:</b> {replyingTo}</span> : ""}

                    <Editor placeholder={"Typ hier uw reactie"} modules={{
                        toolbar: [[{'header': 1}, {'header': 2}], ['bold', 'italic'], ['link', 'blockquote']]
                    }}
                            style={{height: '250px'}}
                            value={newPost.content} onTextChange={(e) => {
                        onInputChanged("content", e.htmlValue)
                    }}/>


                    {authenticated}
                    <div>
                        <Button {...additionalProps} iconPos={"left"} icon={"pi pi-plus"}
                                onClick={() => {
                                    createPost()
                                }} label={"Plaatsen"}/>
                        <Button {...additionalProps}
                                className={"p-button-secondary p-button-outlined p-ml-3"}
                                iconPos={"right"}
                                onClick={() => {
                                    setPostWindow(false)
                                }} label={"Annuleren"}/>
                    </div>
                </div>
            </Sidebar>
        </div>

        <Sidebar visible={newReportOpen} style={{overflowY: "scroll"}}
                 className={"p-col-12 p-md-4"}
                 onHide={() => props.setReportWindow(false)} position="right">
            <Report id={reportId} connection={props.connection}
                    setReportWindow={setReportWindow}/>
        </Sidebar>

        <div>
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <Replies setPostWindow={setPostWindow} menuRef={menuRef}
                             setReportId={setReportId}
                             setReplyingTo={setReplyingTo}
                             replies={replies}
                             connection={props.connection} height={height}
                             isScrolling={isScrolling}
                             onChilScroll={onChildScroll}
                             scrollTop={scrollTop}/>
                )}
            </WindowScroller>
        </div>

        <Dialog breakpoints={{'960px': '75vw', '640px': '100vw'}} dismissableMask={true} keepInViewport={true}
                header="Bijlage" visible={showAttachmentState} onHide={() => {
            onHide();
        }}>
            <img src={attachment} alt="Bijlage" style={{width: "100%", maxHeight: "100%"}}/>
        </Dialog>

        <Tooltip className={"tooltip"} target=".message-posted" position={"bottom"}/>
        <ScrollTop/>
    </div>
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
