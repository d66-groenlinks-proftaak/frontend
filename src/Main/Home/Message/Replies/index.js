import {AutoSizer, CellMeasurer, List, CellMeasurerCache} from "react-virtualized";
import Reply from "./Reply";
import React, {useEffect, useState} from "react";
import {Button} from "primereact/button";

const GetParent = (replies, id) => {
    for (let reply of replies)
        if (reply.id === id)
            return reply;

    for (let reply of replies)
        if (reply.replyContent && reply.replyContent.length > 0) {
            let rValue = GetParent(reply.replyContent, id);
            if (rValue)
                return rValue;
        }
}

function Replies(props) {
    const [replies, setReplies] = useState([]);
    const [displayMore, setDisplayMore] = useState({});
    const [loadingMore, setLoadingMore] = useState({});

    const listRef = React.createRef();
    const _cache = new CellMeasurerCache({
        fixedWidth: true
    })

    const GetRepliesDepth = (level, message) => {
        let replies = [];

        if (message.replyContent)
            for (let reply of message.replyContent) {
                let item = {
                    parent: message.id,
                    id: reply.id,
                    children: [],
                    created: reply.created
                }

                item.element = (<Reply setReplyingTo={(a, b) => {
                    props.setReplyingTo(a, b)
                }} setPostWindow={(b) => {
                    props.setPostWindow(b)
                }} level={level} content={reply.content} menuRef={props.menuRef}
                                       created={reply.created}
                                       id={reply.id}
                                       author={reply.author}
                                       authorId={reply.authorId}/>)

                if (reply.replyContent && reply.replyContent.length > 0) {
                    for (let r of GetRepliesDepth(level + 1, reply))
                        item.children.push(r)
                }

                replies.push(item)
            }

        return replies;
    }

    const _rowRenderer = ({index, key, parent, style}) => {
        const reply = replies[index];

        return <CellMeasurer parent={parent} cache={_cache} columnIndex={0} rowIndex={index} key={key}>
            {() => {
                return <div key={key} style={{...style}}>
                    <Reply
                        setReportId={props.setReportId} setReplyingTo={(a, b) => {
                        props.setReplyingTo(a, b)
                    }} setPostWindow={(b) => {
                        props.setPostWindow(b)
                    }} content={reply.content} menuRef={props.menuRef} created={reply.created} id={reply.id}
                        author={reply.author}
                        authorId={reply.authorId}/>

                    {GetReplies(1, reply)}
                </div>
            }}
        </CellMeasurer>
    }

    const GetReplies = (level, message) => {
        let _replies = GetRepliesDepth(level, message);

        let cur = 0;
        let addToEnd = <span/>
        return <div>
            {_replies.map(reply => {
                cur++;

                let parent;

                for (let _reply of replies) {
                    if (_reply.id === reply.parent) {
                        parent = _reply;
                        break;
                    }
                }

                if (cur === _replies.length && (_replies.length < parent.replies)) {
                    if (displayMore[reply.parent] === true) {
                        addToEnd = <span/>
                    }

                    addToEnd = <Button onClick={() => {
                        setLoadingMore(loadingMore)

                        props.connection.send("LoadSubReplies", reply.id)
                    }} className={"p-button-text p-ml-5"} style={{width: "200px"}}
                                       icon={loadingMore[reply.parent] ? "pi pi-spin pi-spinner" : ""}
                                       iconPos="right"
                                       disabled={loadingMore[reply.parent]} label={"Meer Laden"}/>
                }

                return <div key={reply.id}>
                    {reply.element}
                    {addToEnd}
                </div>;
            })}
        </div>
    }

    useEffect(() => {
        setReplies(props.replies);

        props.connection.on("SendChildren", children => {
            for (let child of children) {
                if (GetParent(replies, child.parent).replyContent)
                    GetParent(replies, child.parent).replyContent.push(child);
                else
                    GetParent(replies, child.parent).replyContent = [child]
            }

            if (children.length > 3) {
                displayMore[children[0].parent] = false;
                loadingMore[children[0].parent] = false;
            } else {
                displayMore[children[0].parent] = true;
                loadingMore[children[0].parent] = true;
            }

            setReplies(replies);
            setDisplayMore(displayMore);
            setLoadingMore(loadingMore);

            _cache.clearAll();
            listRef.current.forceUpdateGrid();
        })

        props.connection.on("SendChild", child => {
            const children = Object.assign([], replies);
            const displayMore = Object.assign({}, displayMore);
            const loadingMore = Object.assign({}, loadingMore);

            let parent;
            for (let _reply in children) {
                if (children.hasOwnProperty(_reply) && children[_reply].id === child.parent)
                    parent = _reply;
            }

            if (child.parent === props.id) {
                children.unshift(child);
            } else {
                if (GetParent(children, child.parent).replyContent) {
                    GetParent(children, child.parent).replyContent.unshift(child);

                    if (GetParent(children, child.parent).replyContent.length >= 4) {
                        displayMore[child.parent] = false;
                        loadingMore[child.parent] = false;
                        children[parent].replies += 1;
                        GetParent(children, child.parent).replyContent.pop();
                    }
                } else
                    GetParent(children, child.parent).replyContent = [child]
            }

            setReplies(children);
            setDisplayMore(displayMore);
            setLoadingMore(loadingMore);

            _cache.clearAll();
            listRef.current.forceUpdateGrid();
        })

        return function cleanup() {
            props.connection.off("SendChildren");
            props.connection.off("SendChild");
        }
    })

    return <AutoSizer disableHeight>
        {({width}) => <List autoHeight
                            isScrolling={props.isScrolling}
                            onScroll={props.onChildScroll}
                            overscanRowCount={2}
                            scrollTop={props.scrollTop} ref={listRef}
                            deferredMeasurementCache={_cache}
                            rowHeight={_cache.rowHeight}
                            width={width} height={props.height}
                            rowCount={replies.length}
                            rowRenderer={_rowRenderer}/>
        }
    </AutoSizer>
}

export default Replies;
