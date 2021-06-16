import React, { Component } from 'react';
import {Button} from "primereact/button";
import {Editor} from "primereact/editor";

class Report extends Component {
    state = {  
        reportMessage: "",
    }
    
    SendReport() {
        this.props.connection.send("ReportMessage", {
            ReportMessage: this.state.reportMessage,
            MessageId: this.props.id
        })
        this.props.setReportWindow(false)
    }


    render() { 
        return (
                <div className="p-grid p-fluid p-p-3 p-pt-3">
                    <h1>Report</h1>
                    <div className="p-col-12">  
                        <h3>Bericht</h3>
                        <Editor style={{height: '320px'}} onTextChange={(e) => {
                            this.setState({reportMessage : e.textValue})
                        }}/>
                    </div>

                    <div className={"p-col-12 p-md-6 p-mt-5"}>
                        <Button {...this.state.additionalProps} iconPos={"right"} onClick={() => {
                         this.SendReport()
                        }} label={"Sturen"}/>
                    </div>
                </div>
          );
    }
}
 
export default Report;