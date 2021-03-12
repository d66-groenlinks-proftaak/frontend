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
            setTimeout(() => {
                this.setState({
                    messages: _messages,
                    loaded: true
                })
            }, 500)
        })

        this.props.connection.on("SendMessage", _message => {
            this.setState(oldState => {
                const messages = [...oldState.messages];
                messages.unshift(_message)

                if (messages.length > 10)
                    messages.pop();

                return {messages: messages}
            })
        })

        this.props.connection.send('RequestUpdate');
    }

    render() {
        let header = <Header loggedIn={this.props.loggedIn} connection={this.props.connection}/>

        if (!this.state.loaded)
            return <div>
                {header}
                <LoadingMessages/>
            </div>

        return <div>
            {header}
            {this.state.messages.map(message => {
                return <Link key={message.id} style={{textDecoration: 'none'}} to={"/thread/" + message.id}>
                    <Message title={message.title} authorId={message.authorId} author={message.author}
                             created={message.created}>
                        {message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}
                    </Message>
                </Link>
            })}
        </div>
    }
}

export default Messages;
