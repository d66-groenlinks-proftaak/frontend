export const getMessageState = store => store.message;

export const getReplyOpen = store => getMessageState(store).replyOpen;
export const getReplyAuthor = store => getMessageState(store).replyAuthor;
export const getReplyAuthorId = store => getMessageState(store).replyAuthorId;
export const getReplies = store => getMessageState(store).replies;

