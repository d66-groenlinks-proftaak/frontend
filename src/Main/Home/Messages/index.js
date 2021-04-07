import React, {useEffect, useState} from "react";
import Header from "./Header";

import Message from "./Message";
import {Link} from "react-router-dom";
import LoadingMessages from "./LoadingMessages";
import {Tag} from "primereact/tag";

function Messages(props) {
    const [messages, setMessages] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {        
        props.connection.send('RequestUpdate');
    }, [])

    useEffect(() => {
        props.connection.on("SendThreads", _messages => {
            setMessages(_messages);
            setLoaded(true);
            console.log(_messages)
        })

        props.connection.on("SendMessage", _message => {
            const title = _message.title;

            const _messages = [...messages];

            let pins = 0;
            for (let message of _messages)
                if (message.pinned)
                    pins++;

            _message.title = <span> <Tag value={"Nieuw"}/> &nbsp; {title} </span>
            console.log(_messages)

            if(pins > 0)
                _messages.splice(pins > 0 ? (pins) : 0, 0, _message);

            if (_messages.length > 10)
                _messages.pop();

                console.log(_messages)

            setMessages(_messages)
        })

        return function cleanup() {
            props.connection.off("SendThreads");
            props.connection.off("SendMessage");
        }
    }, [messages, props.connection])

    let header = <Header setLoaded={setLoaded} loggedIn={props.loggedIn}
                         connection={props.connection}/>

    if (!loaded)
        return <div>
            {header}
            <LoadingMessages/>
        </div>

    return <div>
        {header}
        {messages.map(message => {
            return <Link key={message.id} style={{textDecoration: 'none'}} to={"/thread/" + message.id}>
                <Message guest={message.guest}
                         replies={message.replies}
                         pinned={message.pinned}
                         title={message.title}
                         authorId={message.authorId}
                         author={message.author}
                         created={message.created}
                         content={message.content.replace(/<[^>]*>?/gm, '').substring(0, 600)}>
                </Message>
            </Link>
        })}
    </div>
}

export default Messages;
