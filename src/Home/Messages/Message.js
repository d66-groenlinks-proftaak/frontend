import React from "react";
import {Card} from "primereact/card";
import {Link} from "react-router-dom";

class Message extends React.Component {
    testPrint() {

    }

    render() {
        return <Card className={"p-mt-3 card-hover-1"} title={this.props.title}
                     subTitle={<span><Link to={"/profile/" + this.props.authorId}
                                           style={{color: "blue"}}>@{this.props.author}</Link> op {new Date(this.props.created).toLocaleString()}</span>}>
            {this.props.children}
        </Card>
    }
}

export default Message;
