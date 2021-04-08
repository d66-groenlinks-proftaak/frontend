import React from 'react';

import Thread from './Thread';
import * as PropTypes from "prop-types";

export default {
    title: 'Message/Message/Thread',
    component: Thread,
    argTypes: {
        togglePostWindow: {action: "togglePostWindow"},
        showAttachment: {action: "showAttachment"},
        setReplyingTo: {action: "setReplyingTo"},
        setReportId: {action: "setReportId"},
        setPostWindow: {action: "setPostWindow"},
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
        attachments: {
            description: "Array of attachments for this thread",
            type: {name: 'object', required: false},
            defaultValue: [],
            table: {
                defaultValue: [
                    {test: 1}
                ],
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
        isThread: {
            description: "If this is a thread, or comment",
            type: {name: 'boolean', required: true},
            defaultValue: true,
            table: {
                defaultValue: {summary: true},
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
        menuRef: {
            table: {
                disable: true
            },
        },
    }
}

export const Template = (args) => <Thread {...args}/>

Template.storyName = "Thread";

Template.args = {
    attachments: [],
    id: "1",
    created: 0,
    isThread: true,
    title: "Test123",
    menuRef: () => {
    },
    author: "Example",
    authorId: "3311",
    content: "Test"
}
