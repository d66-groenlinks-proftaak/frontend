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
import Header from "./Header";
import CreateReply from "./CreateReply";
import {setReplyOpen, setReplyingToId, setReplyingTo, setReplies} from "../../../Core/Message/message.actions";
import {getReplyOpen} from "../../../Core/Message/message.selectors";

function Message(props) {
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const [created, setCreated] = useState("");
    const [authorId, setAuthorId] = useState("");
    const [id, setId] = useState("");
    const [locked, setLocked] = useState(true);
    const [title, setTitle] = useState("");
    const [newReportOpen, setNewReportOpen] = useState(false);
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
                props.connection.send();
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
        props.dispatch(setReplyOpen(open));
    }

    const togglePostWindow = () => {
        props.dispatch(setReplyOpen(!props.replyOpen));
    }

    const setReportWindow = (open) => {
        setNewReportOpen(open);
    }

    const setReplyState = (author, id) => {
        props.dispatch(setReplyingToId(id));
        props.dispatch(setReplyingTo(author));
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
            setLocked(thread.parent.locked);


            props.dispatch(setReplies(thread.children));
        })

        props.connection.send("LoadMessageThread", props.id);

        return function cleanup() {
            props.connection.off("SendThreadDetails");
        }
    }, [])

    if (title === "") {
        return <div className={"p-mt-5"}>
            <Header/>
            <LoadingMessage/>
        </div>
    }

    return <div className={"p-mt-5"}>
        <Menu ref={menuRef} popup model={extraOptions}/>

        <Header/>

        <Thread togglePostWindow={togglePostWindow} attachments={attachments}
                showAttachment={(a) => {
                    showAttachment(true, a)
                }} id={id}
                created={created}
                title={title} menuRef={menuRef}
                setReplyingTo={setReplyState}
                author={author} authorId={authorId} content={content} isThread={true} 
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

        <CreateReply id={id}/>

        <Sidebar visible={newReportOpen} style={{overflowY: "scroll"}}
                 className={"p-col-12 p-md-4"}
                 onHide={() => props.setReportWindow(false)} position="right">
            <Report id={reportId} connection={props.connection}
                    setReportWindow={setReportWindow}/>
        </Sidebar>

        <div>
            <WindowScroller scrollElement={window}>
                {({height, isScrolling, onChildScroll, scrollTop}) => (
                    <Replies id={id}
                             setPostWindow={setPostWindow} menuRef={menuRef}
                             setReportId={setReportId}
                             setReplyingTo={setReplyState}
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
        return {loggedIn: getAuthAuthenticated(state), replyOpen: getReplyOpen(state)}
    }

export default connect(mapStateToProps)

(
    Message
)
;
