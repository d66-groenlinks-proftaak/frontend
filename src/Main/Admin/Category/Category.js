import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {confirmDialog} from 'primereact/confirmdialog';

import {connect} from "react-redux";
import {getGlobalConnection} from "../../../Core/Global/global.selectors";

class Category extends React.Component {

    deleteCategory() {
        this.props.connection.send("DeleteCategory", this.props.name);
    }

    render() {
        console.log(this.props)
    return <li style={{fontSize: "1.5em", marginTop: 5, marginLeft: 0}} key={this.props.id}>
            <div className="item" style={{display: "flex"}}>
                <div style={{flex: "90%"}}>
                    <span className="fa-li">{this.props.icon}</span> {this.props.name}
                </div>
                <FontAwesomeIcon style={{color: "salmon", flex: "10%", cursor: "pointer"}} icon={"trash-alt"} onClick=
                {() => confirmDialog({ 
                    message: 'Are you sure you want to delete?',
                    header: 'Confirmation',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => this.deleteCategory(),
                    reject: () => console.log('reject')
                })}/>
            </div>
        </li>
    }
}


const mapStateToProps = (state) => {
    return {
        connection: getGlobalConnection(state)
    }
}

export default connect(mapStateToProps)(Category);