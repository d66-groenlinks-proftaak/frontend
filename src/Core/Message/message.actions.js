export const Actions = {
    setReplyOpen: "[Reply] Set reply open",
    setReplyingTo: "[Reply] Set replying to name",
    setReplyingToId: "[Reply] Set replying to ID",
    setReplies: "[Reply] Set thread replies"
}

export const setReplyOpen = (replyOpen) => ({
    type: Actions.setReplyOpen,
    payload: {
        replyOpen
    }
})

export const setReplyingTo = (replyAuthor) => ({
    type: Actions.setReplyingTo,
    payload: {
        replyAuthor
    }
})

export const setReplyingToId = (replyAuthorId) => ({
    type: Actions.setReplyingToId,
    payload: {
        replyAuthorId
    }
})

export const setReplies = (replies) => ({
    type: Actions.setReplies,
    payload: {
        replies
    }
})
