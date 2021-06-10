import React from "react";
import {Button} from "primereact/button";
import {Sidebar} from 'primereact/sidebar';
import {InputText} from "primereact/inputtext";
import {Editor} from 'primereact/editor';
import {Dropdown} from "primereact/dropdown";
import {getAuthAuthenticated, getAuthToken} from "../../../Core/Authentication/authentication.selectors";
import {connect} from "react-redux";
import {FileUpload} from "primereact/fileupload";
import { Toast } from "primereact/toast";
import { MultiSelect } from 'primereact/multiselect';
import {Checkbox} from 'primereact/checkbox';
import { getPermissions } from "../../../Core/Global/global.selectors";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            newPostOpen: false,
            selectedCategories: [],
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
            invalidAuthor: false,
            currentMessages: 0,
            makeAnnouncement: false,
            isWebinar: false
        }

        this.uploadRef = undefined
        this.toastRef = React.createRef();
        this.upload.bind(this)
         
    }

    setSelectedCategories = (value) => {
        this.setState({
            selectedCategories: value
        });
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
        if (content === undefined || content == null)
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
        console.log("CREATE")
        this.validateInput("title", this.state.newPost.title, () => {
            this.validateInput("content", this.state.newPost.content, () => {
                this.validateInput("email", this.state.newPost.email, () => {
                    this.validateInput("author", this.state.newPost.author, () => {
                        if (this.props.loggedIn && !this.state.invalidTitle && !this.state.invalidContent) {
                            this.uploadRef.upload();
                        } else if (!this.state.invalidAuthor && !this.state.invalidEmail && !this.state.invalidTitle && !this.state.invalidContent) {
                            this.uploadRef.upload();
                        }
                    });
                });
            });
        });
    }

    setCurrentMessages(current) {
        console.log(current);
        this.setState({
            currentMessages: current
        })

        this.props.setLoaded(false);

        this.props.connection.send("RequestSortedList", current);
    }

    upload(files, ref) {
        let formData = new FormData();
        
        for(let i in files.files) {
            formData.append(files.files[i].name, files.files[i]);
        }

        this.setState({
            additionalProps: {
                disabled: true,
                icon: "pi pi-spin pi-spinner"
            }
        })

        formData.append("Title", this.state.newPost.title);
        formData.append("Content", this.state.newPost.content);
        formData.append("Email", this.state.newPost.email);
        formData.append("Author", this.state.newPost.author);
        formData.append("Token", this.props.token);
        formData.append("Announcement", this.state.makeAnnouncement);
        formData.append("Webinar", this.state.isWebinar);

        formData.append("Categories", JSON.stringify(this.state.selectedCategories));

        fetch('http://localhost:5000/message/create', {
            method: 'POST',
            body: formData
        }).then(() => {
            this.setState({
                additionalProps: {}
            })
            ref.clear();
            this.setPostWindow(false);
        }).catch((e) => {
            console.log(e);
        })
    }

     
    render() {

        let authenticated = <div>
            <h3>E-Mail</h3>
            <InputText style={{width: "100%"}} className={this.state.invalidEmail ? "p-invalid" : ""}
                       value={this.state.newPost.email} onChange={e => {
                this.onInputChanged("email", e.target.value)
            }}/>
            <div style={{color: "red"}}>{this.state.invalidEmail ? this.state.invalidEmail :
                <span>&nbsp;</span>}</div>

            <h3>Naam</h3>
            <InputText style={{width: "100%"}} className={this.state.invalidAuthor ? "p-invalid" : ""}
                       value={this.state.newPost.author} onChange={e => {
                this.onInputChanged("author", e.target.value)
            }}/>
            <div style={{color: "red"}}>{this.state.invalidAuthor ? this.state.invalidAuthor :
                <span>&nbsp;</span>}</div>
        </div>

        if (this.props.loggedIn)
            authenticated = "";

        const messageTypes = [
            {label: "Nieuwste", value: 0},
            {label: "Top", value: 1},
            {label: "Oudste", value: 2},
        ]

        const categories = [
            {name: 'Corona', value: 'Corona'},
            {name: 'Gemeente', value: 'Gemeente'},
            {name: 'Afval', value: 'Afval'},
            {name: 'Racisme', value: 'Racisme'}
        ];

        return <div>

            <div className="p-d-flex p-jc-between p-ai-center" style={{marginBottom: 30, marginTop: 15}}>
                <div>
                    <Dropdown optionLabel={"label"} value={this.state.currentMessages} options={messageTypes}
                              onChange={(e) => this.setCurrentMessages(e.value)}/>
                </div>
                <div>
                    <Button onClick={() => {
                        this.setPostWindow(true)
                    }} label="Nieuw Bericht" style={{float: "right"}} icon="pi pi-plus" iconPos="right"/>
                </div>
            </div>

            <div className={"p-grid"}>
                <Sidebar className={"p-col-12 new-post p-grid p-justify-center p-nogutter"}
                         style={{overflowY: "scroll", overflowX: "hidden", width: "100%"}}
                         position="bottom"
                         showCloseIcon={false}
                         visible={this.state.newPostOpen} onHide={() => this.setPostWindow(false)}>
                    <div className="new-post-settings p-p-3 p-pt-3 p-d-flex p-jc-between">
                        <MultiSelect optionLabel={"name"} value={this.state.selectedCategories} options={categories} onChange={(e) => this.setSelectedCategories(e.value)} placeholder="Kies Categorie"/>

                        { this.props.permissions.includes(3) ? <div style={{float: "right"}}>
                            <label>Webinar &nbsp;</label>
                            <Checkbox onChange={e => this.setState({ isWebinar: !this.state.isWebinar })} checked={this.state.isWebinar}/>
                        </div> : "" }
                        { this.props.permissions.includes(4) ? <div>
                            <label>Mededeling &nbsp;</label>
                            <Checkbox onChange={e => this.setState({ makeAnnouncement: !this.state.makeAnnouncement })} checked={this.state.makeAnnouncement}/>
                        </div> : "" }
                        
                        
                    </div>
                    <div className="new-post-content p-p-3 p-pt-3">

                        <InputText style={{width: "100%"}} placeholder={"Titel"}
                                   className={this.state.invalidTitle ? "p-invalid" : ""}
                                   value={this.state.newPost.title} onChange={e => {
                            this.onInputChanged("title", e.target.value)
                        }}/>
                        <div style={{color: "red"}}>{this.state.invalidTitle ? this.state.invalidTitle :
                            <span>&nbsp;</span>}</div>

                        <Editor placeholder={"Typ hier uw bericht"} modules={{
                            toolbar: [[{'header': 1}, {'header': 2}], ['bold', 'italic'], ['link']]
                        }} className={this.state.invalidTitle ? "p-invalid" : ""}
                                style={{height: '250px'}}
                                value={this.state.newPost.content} onTextChange={(e) => {
                            this.onInputChanged("content", e.htmlValue)
                        }}/>

                        <div style={{color: "red"}}>{this.state.invalidContent ? this.state.invalidContent :
                            <span>&nbsp;</span>}</div>

                        <b>Voeg maximaal 2 bestanden toe</b>
                        <FileUpload ref={(ref) => {
                            this.uploadRef = ref;
                        }} onProgress={this.select} customUpload={true} uploadHandler={(files) => {
                            this.upload(files, this.uploadRef);
                        }} chooseLabel="Bestanden Kiezen" name="demo[]" url="./upload" multiple />


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
                <Toast ref={this.toastRef}/>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => {
    return {loggedIn: getAuthAuthenticated(state), token: getAuthToken(state), permissions: getPermissions(state)}
}

export default connect(mapStateToProps)(Header);
