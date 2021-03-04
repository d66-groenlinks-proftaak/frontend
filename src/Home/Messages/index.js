import React from "react";
import Header from "./Header";

import { HubConnectionBuilder } from '@microsoft/signalr';
import Message from "./Message";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: []
        }
    }

    componentDidMount() {
        const connection = new HubConnectionBuilder()
            .withUrl('http://localhost:5000/hub/message')
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(result => {
                connection.on("SendMessages", _messages => {
                    this.setState({
                        messages: _messages
                    })

                    console.log(_messages);
                })

                connection.on("SendMessage", _message => {
                    this.setState(oldState => {
                        const messages = [...oldState.messages];
                        messages.unshift(_message)

                        return { messages }
                    })

                    console.log(_message);
                })

                connection.send('RequestUpdate')
                    .then(e => {
                    })
            })
    }

    render() {
        return <div>
            <Header api={this.props.api} />

            {this.state.messages.map(message => {
                return <Message title={message.title} author={message.author} created={message.created}>
                    <div dangerouslySetInnerHTML={{__html: message.content}}/>
                </Message>
            })}
        </div>
    }
}

export default Messages;