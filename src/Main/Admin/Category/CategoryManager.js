import React from 'react';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import Category from './Category';

import {connect} from "react-redux";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";

import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

class CategoryManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categories: [],
            visible: false,
            name: '',
            icon: ''
        }
    }

    

    componentDidMount() {
        this.props.connection.on("SendCategories", (retrievedCategories) => {
            console.log(retrievedCategories)
            this.setState({
                categories: retrievedCategories
            })
        })

        this.props.connection.send("GetCategories")
    }

    setEditorVisible(vis) {
        this.setState({
            visible: vis
        })
    }

    setName(n) {
        this.setState({
            name: n
        })
    }

    setIcon(i) {
        this.setState({
            icon: i
        })
    }

    addCategory() {
        this.props.connection.send("AddCategory", this.state.name, this.state.icon)
    }
    
    render() {
        return <div>
            <h1>Thema Beheer</h1>
            <ul className={"fa-ul"}>
            {this.state.categories.map(cat => {
                    return <Category id={cat.id} icon={<FontAwesomeIcon icon={cat.icon} key={cat.id}/>} name={cat.name} value={false} />
                })}
            </ul>

            <div>
                <span style={{cursor: "pointer"}} onClick={() => this.setEditorVisible(true)}>Voeg thema toe</span>
            </div>

            <Sidebar className={"p-col-12  p-grid p-nogutter"} showCloseIcon={false}
                         style={{overflowY: "scroll", overflowX: "hidden", width: "100%", height: '40%'}} visible={this.state.visible} onHide={() => this.setEditorVisible(false)} position="bottom">
                <h1>Maak een nieuw thema</h1>
                <div style={{display: "flex"}}>
                    <div style={{flex: "50%"}}>
                        <h2>Naam:</h2>
                        <InputText value={this.state.name} onChange={(e) => this.setName(e.target.value)} />
                    </div>
                    <div style={{flex: "50%"}}>
                    	<h2>Pictogram:</h2>
                        <InputText value={this.state.icon} onChange={(e) => this.setIcon(e.target.value)} />
                    </div>
                </div>
                <Button label="Save" onClick={() => this.addCategory()} />
            </Sidebar>
        </div>
    }

}

const mapStateToProps = (state) => {
    return {
        connection: getGlobalConnection(state)
    }
}

export default connect(mapStateToProps)(CategoryManager);