import {Actions} from "./message.actions";

const initialState = {
    replyOpen: false,
    replyAuthor: "",
    replyAuthorId: "",
    replies: []
}

export default function messageReducer(state = initialState, action) {
    switch (action.type) {
        case Actions.setReplyOpen:
            return {...state, replyOpen: action.payload.replyOpen}
        case Actions.setReplyingTo:
            return {...state, replyAuthor: action.payload.replyAuthor}
        case Actions.setReplyingToId:
            return {...state, replyAuthorId: action.payload.replyAuthorId}
        case Actions.setReplies:
            return {...state, replies: action.payload.replies}
        default:
            return state;
    }
}
