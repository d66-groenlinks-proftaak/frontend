import React from "react";
import Header from "./Header";

import Message from "./Message";
import {Link} from "react-router-dom";
import LoadingMessages from "./LoadingMessages";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            loaded: false
        }
    }

    componentDidMount() {
        this.props.connection.on("SendThreads", _messages => {
            this.setState({
                messages: _messages
            })
        })

        this.props.connection.on("SendMessage", _message => {
            this.setState(oldState => {
                const messages = [...oldState.messages];
                messages.unshift(_message)

                if (messages.length > 10)
                    messages.pop();

                return {messages: messages, loaded: true}
            })
        })

        this.props.connection.send('RequestUpdate');
    }

    render() {
        if (this.state.loading)
            return <div>
                <h1>Nieuwe Berichten</h1>
                <LoadingMessages/>
            </div>

        return <div>
            <Header loggedIn={this.props.loggedIn} connection={this.props.connection}/>
            {this.state.messages.map(message => {
                return <Link key={message.id} style={{textDecoration: 'none'}} to={"/thread/" + message.id}>
                    <Message title={message.title} author={message.author} created={message.created}>
                        {message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}
                    </Message>
                </Link>
            })}
        </div>
    }
}

export default Messages;
