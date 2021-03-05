import React from "react";
import {Card} from "primereact/card";

class Message extends React.Component {
    testPrint() {

    }

    render() {
        return <Card className={"p-mt-3 card-hover-1"} title={this.props.title} subTitle={<span><span style={{color: "blue"}}>@{this.props.author}</span> op {new Date(this.props.created).toLocaleString()}</span>}>
            {this.props.children}
        </Card>
    }
}

export default Message;