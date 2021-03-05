import React from "react";
import Header from "./Header";

import Message from "./Message";
import {Link} from "react-router-dom";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        this.props.connection.on("SendMessages", _messages => {
            this.setState({
                messages: _messages
            })
        })

        this.props.connection.on("SendMessage", _message => {
            this.setState(oldState => {
                const messages = [...oldState.messages];
                messages.unshift(_message)

                if(messages.length > 10)
                    messages.pop();

                return { messages }
            })
        })

        this.props.connection.send('RequestUpdate');
    }

    render() {
        return <div>
            <Header connection={this.props.connection} />
            {this.state.messages.map(message => {
                return <Link key={message.id} style={{ textDecoration: 'none' }} to={"/thread/" + message.id}>
                    <Message title={message.title} author={message.author} created={message.created}>
                        <div dangerouslySetInnerHTML={{__html: message.content}}/>
                    </Message>
                </Link>
            })}
        </div>
    }
}

export default Messages;