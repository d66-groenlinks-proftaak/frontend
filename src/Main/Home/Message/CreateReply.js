import {Sidebar} from "primereact/sidebar";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import React, {useState} from "react";
import {connect} from "react-redux";
import {getAuthAuthenticated} from "../../../Core/Authentication/authentication.selectors";
import {getReplyAuthor, getReplyAuthorId, getReplyOpen} from "../../../Core/Message/message.selectors";
import {setReplyOpen} from "../../../Core/Message/message.actions";
import {InputText} from "primereact/inputtext";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";

function CreateReply(props) {

    const [additionalProps, setAdditionalProps] = useState({});
    const [newPost, setNewPost] = useState({
        content: "",
        email: "",
        author: ""
    });

    const onInputChanged = (type, content) => {
        newPost[type] = content;

        setNewPost(newPost);
    }

    const createPost = () => {
        setAdditionalProps({
            disabled: true,
            icon: "pi pi-spin pi-spinner"
        })

        let parent = props.id;

        if (props.authorId !== "")
            parent = props.authorId;

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

            props.dispatch(setReplyOpen(false));
        })
            .catch(e => {
                setAdditionalProps({})

                alert(e.message);
            })
    }

    return <div className={"p-grid p-nogutter"}>
        <Sidebar className={"p-col-12 new-post p-grid p-justify-center p-nogutter"}
                 style={{overflowY: "scroll", overflowX: "hidden", width: "100%"}}
                 position="bottom"
                 showCloseIcon={false}
                 visible={props.open} onHide={() => props.dispatch(setReplyOpen(false))}>
            <div className="new-post-content p-p-3 p-pt-3">

                {props.author !== "" ?
                    <span><b>Reageren op:</b> {props.author}</span> : ""}

                <Editor placeholder={"Typ hier uw reactie"} modules={{
                    toolbar: [[{'header': 1}, {'header': 2}], ['bold', 'italic'], ['link', 'blockquote']]
                }}
                        style={{height: '250px'}}
                        value={newPost.content} onTextChange={(e) => {
                    onInputChanged("content", e.htmlValue)
                }}/>

                {!props.authenticated ? <div>
                    <h3>E-Mail</h3>
                    <InputText value={newPost.email} onChange={e => {
                        onInputChanged("email", e.target.value)
                    }}/>

                    <h3>Naam</h3>
                    <InputText value={newPost.author} onChange={e => {
                        onInputChanged("author", e.target.value)
                    }}/>
                </div> : ""}

                <div>
                    <Button {...additionalProps} iconPos={"left"} icon={"pi pi-plus"}
                            onClick={() => {
                                createPost()
                            }} label={"Plaatsen"}/>
                    <Button {...additionalProps}
                            className={"p-button-secondary p-button-outlined p-ml-3"}
                            iconPos={"right"}
                            onClick={() => {
                                props.dispatch(setReplyOpen(false));
                            }} label={"Annuleren"}/>
                </div>
            </div>
        </Sidebar>
    </div>
}

const mapStateToProps = (state) => {
    return {
        authenticated: getAuthAuthenticated(state),
        open: getReplyOpen(state),
        author: getReplyAuthor(state),
        authorId: getReplyAuthorId(state),
        connection: getGlobalConnection(state)
    }
}

export default connect(mapStateToProps)(CreateReply)
