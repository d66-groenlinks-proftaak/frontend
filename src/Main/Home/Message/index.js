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
import {getAuthAuthenticated, getAuthId} from "../../../Core/Authentication/authentication.selectors";
import {connect} from "react-redux";
import {WindowScroller} from "react-virtualized";
import Replies from "./Replies";
import Thread from "./Thread";
import Header from "./Header";
import CreateReply from "./CreateReply";
import {setReplyOpen, setReplyingToId, setReplyingTo, setReplies} from "../../../Core/Message/message.actions";
import {getReplyOpen} from "../../../Core/Message/message.selectors";
import {FileUpload} from "primereact/fileupload";


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
    const [editWindow, setEditWindow] = useState(false);
    const [invalidContent, setInvalidContent] = useState(false);
    const [invalidTitle, setInvalidTitle] = useState(false);
    const [additionalProps, setAdditionalProps] = useState({});
    const [uploadRef, setUploadRef] = useState();
    const [editMessageContent, setEditMessageContent] = useState({});
    const [editMessageTitle, setEditMessageTitle] = useState({});



    const menuRef = React.createRef();

    const extraOptions = [{
        label: "Rapporteer",
        icon: "pi pi-ban",
        command: () => {
            setReportWindow(true);
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

    const onInputChanged = (type, content) => {
        validateInput(type, content)

/*        this.setState(oldState => {
            const newPost = oldState.newPost;
            newPost[type] = content;

            return {newPost}
        })*/
        if(type === "content"){
            setEditMessageContent(content)
        }
        else if (type === "title"){
            setEditMessageTitle(content)
        }

    }

    const validateInput = (type, content, cb) => {
        console.log(type,content)
        if (content === undefined)
            return;

        if (type === "title") {
            if (content.length > 40) {
                setInvalidTitle("De title is te lang")
            } else if (content.length <= 5) {
                setInvalidTitle("De titel is te kort")
            } else {
                setInvalidTitle(false)
            }
        }

        if (type === "content") {
            if (content.length > 2000) {
                setInvalidContent("De tekst is te lang")
            } else if (content.length <= 10) {
                setInvalidContent("De tekst is te kort")
            } else {
                setInvalidContent(false)
            }
        }
    }

    const createPost = () => {
        console.log("CREATE")
        validateInput("title", editMessageTitle, () => {
            validateInput("content", editMessageContent, () => {
                if (this.props.loggedIn && !invalidTitle&& !invalidContent) {
                    uploadRef.upload();
                        } else if (!invalidTitle && !invalidContent) {
                            uploadRef.upload();
                        }
                    });
                });
    }

    const upload = (files, ref) => {
        let formData = new FormData();

        for(let i in files.files) {
            formData.append(files.files[i].name, files.files[i]);
        }

        setAdditionalProps({
                disabled: true,
                icon: "pi pi-spin pi-spinner"
        })

        formData.append("Title", this.state.newPost.title);
        formData.append("Content", this.state.newPost.content);
        formData.append("Email", this.state.newPost.email);
        formData.append("Author", this.state.newPost.author);
        formData.append("Token", this.props.token);

        fetch('http://localhost:5000/message/create', {
            method: 'POST',
            body: formData
        }).then(() => {
            setAdditionalProps({})

            ref.clear();
            setEditWindow(false);
        }).catch((e) => {
            console.log(e);
        })
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
    console.log(authorId, props.accountId)



    if(authorId === props.accountId){
        extraOptions.push({
            label: "Bewerken",
            icon: "pi pi-pencil",
            command: () => {
                setEditWindow(true)
            }
        },)
    }


    return <div className={"p-mt-5"}>
        <Menu ref={menuRef} popup model={extraOptions}/>

        <Header/>

        <Sidebar className={"p-col-12 new-post p-grid p-justify-center p-nogutter"}
                 style={{overflowY: "scroll", overflowX: "hidden", width: "100%"}}
                 position="bottom"
                 showCloseIcon={false}
                 visible={editWindow} onHide={() => setEditWindow(false)}>
            <div className="new-post-content p-p-3 p-pt-3">
                <InputText style={{width: "100%"}} placeholder={"Titel"}
                           className={invalidTitle ? "p-invalid" : ""}
                           value={title} onChange={e => {
                    onInputChanged("title", e.target.value)
                }}/>
                <div style={{color: "red"}}>{invalidTitle ? invalidTitle :
                    <span>&nbsp;</span>}</div>

                <Editor placeholder={"Typ hier uw bericht"} modules={{
                    toolbar: [[{'header': 1}, {'header': 2}], ['bold', 'italic'], ['link']]
                }} className={invalidContent ? "p-invalid" : ""}
                        style={{height: '250px'}}
                        value={content} onTextChange={(e) => {
                    console.log(e)
                    onInputChanged("content", e.htmlValue)
                }}/>

                <div style={{color: "red"}}>{invalidContent ? invalidContent:
                    <span>&nbsp;</span>}</div>

                <b>Voeg maximaal 2 bestanden toe</b>
                <FileUpload ref={(ref) => {
                    setUploadRef(ref)
                }}  customUpload={true} uploadHandler={(files) => {
                    upload(files, uploadRef);
                }} chooseLabel="Bestanden Kiezen" name="demo[]" url="./upload" multiple />

                <div>
                    <Button {...additionalProps} iconPos={"left"} icon={"pi pi-plus"}
                            onClick={() => {
                                createPost()
                            }} label={"Plaatsen"}/>
                    <Button {...additionalProps}
                            className={"p-button-secondary p-button-outlined p-ml-3"}
                            iconPos={"right"}
                            onClick={() => {
                                setEditWindow(false)
                            }} label={"Annuleren"}/>
                </div>
            </div>
        </Sidebar>
        <Thread togglePostWindow={togglePostWindow} attachments={attachments}
                showAttachment={(a) => {
                    showAttachment(true, a)
                }} id={id}
                created={created}
                title={title} menuRef={menuRef}
                setReplyingTo={setReplyState}
                setReportId={setReportId}
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
        return {loggedIn: getAuthAuthenticated(state), replyOpen: getReplyOpen(state), accountId: getAuthId(state)}
    }

export default connect(mapStateToProps)

(
    Message
)
;
