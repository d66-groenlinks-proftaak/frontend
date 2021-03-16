import React from "react";
import Header from "./Header";

import Message from "./Message";
import {Link} from "react-router-dom";
import LoadingMessages from "./LoadingMessages";
import {Tag} from "primereact/tag";

class Messages extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [],
            loaded: false
        }
    }

    setLoaded = (b) => {
        this.setState({
            loaded: b
        })
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
            const title = _message.title;
            this.setState(oldState => {
                const messages = [...oldState.messages];

                let pins = 0;
                for (let message of messages)
                    if (message.pinned)
                        pins++;

                _message.title = <span> <Tag value={"Nieuw"}/> &nbsp; {title} </span>

                messages.splice(pins > 0 ? (pins) : 0, 0, _message);

                if (messages.length > 10)
                    messages.pop();

                return {messages: messages}
            })
        })

        this.props.connection.send('RequestUpdate');
    }

    render() {
        let header = <Header setLoaded={this.setLoaded} loggedIn={this.props.loggedIn}
                             connection={this.props.connection}/>

        if (!this.state.loaded)
            return <div>
                {header}
                <LoadingMessages/>
            </div>

        return <div>
            {header}
            {this.state.messages.map(message => {
                return <Link key={message.id} style={{textDecoration: 'none'}} to={"/thread/" + message.id}>
                    <Message guest={message.guest}
                             replies={message.replies}
                             pinned={message.pinned}
                             title={message.title}
                             authorId={message.authorId}
                             author={message.author}
                             created={message.created}>
                        {message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}
                    </Message>
                </Link>
            })}
        </div>
    }
}

export default Messages;
