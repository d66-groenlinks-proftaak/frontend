import React from "react";
import { Button } from "primereact/button";
import { Sidebar } from 'primereact/sidebar';
import { InputText } from "primereact/inputtext";
import { Editor } from 'primereact/editor';

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
            }
        }
    }

    setPostWindow = (open) => {
        this.setState({
            newPostOpen: open
        });
    }

    onInputChanged = (type, content) => {
        this.setState(oldState => {
            const newPost = oldState.newPost;
            newPost[type] = content;

            return { newPost }
        })
    }

    createPost() {
        this.setState({
            additionalProps: {
                disabled: true,
                icon: "pi pi-spin pi-spinner"
            }
        })
        this.props.api.post("/message/new", {
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
            .catch(e => {
                this.setState({
                    additionalProps: {}
                })

                alert(e.message);
            })
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
                            <InputText value={this.state.newPost.title} onChange={e => { this.onInputChanged("title", e.target.value) }}/>

                            <h3>Bericht</h3>
                            <Editor style={{height:'320px'}} value={this.state.newPost.content} onTextChange={(e) => { this.onInputChanged("content", e.htmlValue)}} />

                            <h3>E-Mail</h3>
                            <InputText value={this.state.newPost.email} onChange={e => { this.onInputChanged("email", e.target.value) }}/>

                            <h3>Naam</h3>
                            <InputText value={this.state.newPost.author} onChange={e => { this.onInputChanged("author", e.target.value) }}/>
                        </div>

                        <div className={"p-col-12 p-md-6 p-mt-5"}>
                            <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => { this.createPost() }} label={"Plaatsen"}/>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </div>
    }
}

export default Header;