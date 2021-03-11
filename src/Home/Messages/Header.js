import React from "react";
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';
import { Tooltip} from 'primereact/tooltip';

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
            invalid:{}
        }
        this.validateInput("title", "");
        this.validateInput("content","");
        this.validateInput("email","");
        this.validateInput("author","");
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

    validateInput(type, content){
        if(type == "title") {
            if(content && content.length > 40) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.title = "De titel is te lang!";
                    return {invalid:oldInvalid}
                })
            } else if(content && content.length <= 5) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.title = "De titel is te kort!";
                    return {invalid:oldInvalid}
                })
            } else {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.title = false;
                    return {invalid:oldInvalid}
                })
            }
        }
        if(type == "content") {
            if(content && content.length > 2000) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.content = "Het bericht is te lang!";
                    return {invalid:oldInvalid}
                })
            } else if(content && content.length <= 10) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.content = "Het bericht is te kort!";
                    return {invalid:oldInvalid}
                })
            } else {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.content = false;
                    return {invalid:oldInvalid}
                })
            }
        }
        if(type == "email") {
            if(this.validateEmail(content)) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.email = false;
                    return {invalid:oldInvalid}
                })
            }else {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.email = "Het email is ongeldig!";
                    return {invalid:oldInvalid}
                })
            } 
        }
        if(type == "author") {
            if(content && content.length > 50) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.author = "De naam is te lang!";
                    return {invalid:oldInvalid}
                })
            } else if(content && content.length <= 1) {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.author = "De naam is te kort!";
                    return {invalid:oldInvalid}
                })
            } else {
                this.setState(oldState => {
                    const oldInvalid = Object.assign({}, oldState.invalid);
                    oldInvalid.author = false;
                    return {invalid:oldInvalid}
                })
            }
        }
    }
    onInputChanged = (type, content) => {
        this.validateInput(type, content)

        this.setState(oldState => {
            const newPost = oldState.newPost;
            newPost[type] = content;

            return { newPost }
        })
    }

    createPost() {
        this.validateInput("title", this.state.newPost.title);
        this.validateInput("content",this.state.newPost.content);
        this.validateInput("email",this.state.newPost.email);
        this.validateInput("author",this.state.newPost.author);
        
        let invalidState = false;

        for(let i in this.state.invalid) {
            if(this.state.invalid[i] != false) {
                invalidState = true;
                break;
            }
        }
        console.log(this.state);
        if(!invalidState) {

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
        }

    render() {

        return <div>

            <div className="p-d-flex p-jc-between p-ai-center">
                <h1>Nieuwe Berichten</h1>
                <div>
                    <Button onClick={() => { this.setPostWindow(true) }} label="" style={{float: "right"}} icon="pi pi-plus" iconPos="right" />
                </div>
            </div>

            <div className={"p-grid"}>
                <Sidebar style={{overflowY: "scroll"}} className={"p-col-12 p-md-4"} position="right" visible={this.state.newPostOpen} onHide={() => this.setPostWindow(false)}>
                    <div className="p-grid p-fluid p-p-3 p-pt-3">
                        <h1>Nieuw Bericht Aanmaken</h1>

                        <div className="p-col-12">
                            <h3>Titel</h3>
                            <InputText className={this.state.invalid.title ? "p-invalid" : ""} value={this.state.newPost.title} onChange={e => { this.onInputChanged("title", e.target.value) }}/>
                            <div style={{color:"red"}}>{ this.state.invalid.title ? this.state.invalid.title : <span>&nbsp;</span>}</div>

                            <h3>Bericht</h3>
                            <Editor style={{height:'320px'}} value={this.state.newPost.content} onTextChange={(e) => { this.onInputChanged("content", e.htmlValue)}} />
                            <div style={{color:"red"}}>{ this.state.invalid.content ? this.state.invalid.content : <span>&nbsp;</span>}</div>

                            <h3>E-Mail</h3>
                            <InputText value={this.state.newPost.email} onChange={e => { this.onInputChanged("email", e.target.value) }}/>
                            <div style={{color:"red"}}>{ this.state.invalid.email ? this.state.invalid.email : <span>&nbsp;</span>}</div>

                            <h3>Naam</h3>
                            <InputText value={this.state.newPost.author} onChange={e => { this.onInputChanged("author", e.target.value) }}/>
                            <div style={{color:"red"}}>{ this.state.invalid.author ? this.state.invalid.author : <span>&nbsp;</span>}</div>
                        </div>

                        <div className={"p-col-12 p-md-6 p-mt-5"}>
                            <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => {this.createPost()}} label={"Plaatsen"}/>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </div>
    }
}

export default Header;