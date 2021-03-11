import React from "react";
import {Button} from "primereact/button";
import {Sidebar} from 'primereact/sidebar';
import {InputText} from "primereact/inputtext";
import {Editor} from 'primereact/editor';
import {Tooltip} from 'primereact/tooltip';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPostOpen: false,
            additionalProps: {},
            newPost: {
                title: "",
                content: "",
                email: "",
                author: ""
            },
            invalidTitle: false,
            invalidContent: false,
            invalidEmail: false,
            invalidAuthor: false
        }
    }

    setPostWindow = (open) => {
        this.setState({
            newPostOpen: open
        });
    }

    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    validateInput(type, content, cb) {
        if (content === undefined)
            return;

        if (type === "title") {
            if (content.length > 40) {
                this.setState({invalidTitle: "De titel is te lang"}, cb)
            } else if (content.length <= 5) {
                this.setState({invalidTitle: "De titel is te kort"}, cb)
            } else {
                this.setState({invalidTitle: false}, cb)
            }
        }

        if (type === "content") {
            if (content.length > 2000) {
                this.setState({invalidContent: "De tekst is te lang"}, cb)
            } else if (content.length <= 10) {
                this.setState({invalidContent: "De tekst is te kort"}, cb)
            } else {
                this.setState({invalidContent: false}, cb)
            }
        }
        if (type === "email") {
            if (this.validateEmail(content)) {
                this.setState({invalidEmail: false}, cb)
            } else {
                this.setState({invalidEmail: "Het email is ongeldig"}, cb)
            }
        }
        if (type === "author") {
            if (content.length > 50) {
                this.setState({invalidAuthor: "De naam is te lang"}, cb)
            } else if (content.length < 2) {
                this.setState({invalidAuthor: "De naam is te kort"}, cb)
            } else {
                this.setState({invalidAuthor: false}, cb)
            }
        }
    }

    onInputChanged = (type, content) => {
        this.validateInput(type, content)

        this.setState(oldState => {
            const newPost = oldState.newPost;
            newPost[type] = content;

            return {newPost}
        })
    }

    createPost() {
        this.validateInput("title", this.state.newPost.title, () => {
            this.validateInput("content", this.state.newPost.content, () => {
                this.validateInput("email", this.state.newPost.email, () => {
                    this.validateInput("author", this.state.newPost.author, () => {
                        if (!this.state.invalidTitle && !this.state.invalidAuthor && !this.state.invalidContent && !this.state.invalidEmail) {
                            this.setState({
                                additionalProps: {
                                    disabled: true,
                                    icon: "pi pi-spin pi-spinner"
                                }
                            })

                            this.props.connection.send("CreateMessage", {
                                Title: this.state.newPost.title,
                                Content: this.state.newPost.content,
                                Email: this.state.newPost.email,
                                Author: this.state.newPost.author,
                            })
                                .then(result => {
                                    this.setState({
                                        additionalProps: {}
                                    })

                                    this.setPostWindow(false);
                                })
                        }
                    });
                });
            });
        });
    }

    render() {

        return <div>

            <div className="p-d-flex p-jc-between p-ai-center">
                <h1>Nieuwe Berichten</h1>
                <div>
                    <Button onClick={() => {
                        this.setPostWindow(true)
                    }} label="" style={{float: "right"}} icon="pi pi-plus" iconPos="right"/>
                </div>
            </div>

            <div className={"p-grid"}>
                <Sidebar style={{overflowY: "scroll"}} className={"p-col-12 p-md-4"} position="right"
                         visible={this.state.newPostOpen} onHide={() => this.setPostWindow(false)}>
                    <div className="p-grid p-fluid p-p-3 p-pt-3">
                        <h1>Nieuw Bericht Aanmaken</h1>

                        <div className="p-col-12">
                            <h3>Titel</h3>
                            <InputText className={this.state.invalidTitle ? "p-invalid" : ""}
                                       value={this.state.newPost.title} onChange={e => {
                                this.onInputChanged("title", e.target.value)
                            }}/>
                            <div style={{color: "red"}}>{this.state.invalidTitle ? this.state.invalidTitle :
                                <span>&nbsp;</span>}</div>

                            <h3>Bericht</h3>
                            <Editor className={this.state.invalidTitle ? "p-invalid" : ""} style={{height: '320px'}}
                                    value={this.state.newPost.content} onTextChange={(e) => {
                                this.onInputChanged("content", e.htmlValue)
                            }}/>
                            <div style={{color: "red"}}>{this.state.invalidContent ? this.state.invalidContent :
                                <span>&nbsp;</span>}</div>

                            <h3>E-Mail</h3>
                            <InputText className={this.state.invalidEmail ? "p-invalid" : ""}
                                       value={this.state.newPost.email} onChange={e => {
                                this.onInputChanged("email", e.target.value)
                            }}/>
                            <div style={{color: "red"}}>{this.state.invalidEmail ? this.state.invalidEmail :
                                <span>&nbsp;</span>}</div>

                            <h3>Naam</h3>
                            <InputText className={this.state.invalidAuthor ? "p-invalid" : ""}
                                       value={this.state.newPost.author} onChange={e => {
                                this.onInputChanged("author", e.target.value)
                            }}/>
                            <div style={{color: "red"}}>{this.state.invalidAuthor ? this.state.invalidAuthor :
                                <span>&nbsp;</span>}</div>
                        </div>

                        <div className={"p-col-12 p-md-6 p-mt-5"}>
                            <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => {
                                this.createPost()
                            }} label={"Plaatsen"}/>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </div>
    }
}

export default Header;
