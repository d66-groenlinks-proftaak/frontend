import React from 'react';

import Reply from './Reply';

export default {
    title: 'Message/Message/Reply',
    component: Reply,
    argTypes: {
        setReportId: {action: "setReportId"},
        setPostWindow: {action: "setPostWindow"},
        setReplyingTo: {action: "setReplyingTo"},
        content: {
            description: "Content of the thread",
            type: {name: 'string', required: true},
            defaultValue: "hah",
            table: {
                defaultValue: {summary: ''},
            },
        },
        id: {
            description: "ID of the thread",
            type: {name: 'string', required: true},
            defaultValue: "hah",
            table: {
                defaultValue: {summary: '1'},
            },
        },
        level: {
            description: "Reply depth",
            type: {name: 'number', required: true},
            defaultValue: 0,
            table: {
                defaultValue: {summary: 0},
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
        menuRef: {
            table: {
                disable: true
            },
        },
    }
}

export const Template = (args) => <Reply {...args}></Reply>

Template.storyName = "Reply"

Template.args = {
    menuRef: () => {
    },
    content: "Test",
    created: 19000000,
    id: 1,
    author: "Kane",
    authorId: "Test123"
}
