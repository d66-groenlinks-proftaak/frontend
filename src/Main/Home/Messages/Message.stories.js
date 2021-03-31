import React from 'react';

import Message from './Message';

export default {
    title: 'Message/Message List/Message',
    component: Message,
    argTypes: {
        content: {
            description: "Content of the thread",
            type: {name: 'string', required: true},
            defaultValue: "hah",
            table: {
                defaultValue: {summary: ''},
            },
        },
        created: {
            description: "Time in miliseconds from epoch when this thread was created",
            type: {name: 'number', required: true},
            defaultValue: 0,
            table: {
                defaultValue: {summary: 0},
            },
        },
        title: {
            description: "Title of this thread",
            type: {name: 'string', required: true},
            defaultValue: '',
            table: {
                defaultValue: {summary: ""},
            },
        },
        author: {
            description: "Name of the author for this thread",
            type: {name: 'string', required: true},
            defaultValue: '',
            table: {
                defaultValue: {summary: ""},
            },
        },
        authorId: {
            description: "ID of the author for this thread",
            type: {name: 'string', required: true},
            defaultValue: '',
            table: {
                defaultValue: {summary: ""},
            },
        },
        guest: {
            description: "Whether this message was posted by a guest",
            type: {name: 'boolean', required: true},
            defaultValue: '',
            table: {
                defaultValue: {summary: false},
            },
        },
        pinned: {
            description: "Whether this message is pinned",
            type: {name: 'boolean', required: true},
            defaultValue: '',
            table: {
                defaultValue: {summary: false},
            },
        },
    }
}

export const _Message = (args) => <Message {...args} replies={[]} extraOptions={[]}/>

_Message.args = {
    guest: false,
    pinned: false,
    title: "Test",
    authorId: "123",
    author: "Test",
    content: "Hah",
    created: 19000000
}
