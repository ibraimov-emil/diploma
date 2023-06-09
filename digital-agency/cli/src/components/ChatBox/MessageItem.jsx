import React, {useContext, useState} from "react";
import {observer} from "mobx-react-lite";
import {format} from "timeago.js";
const MessageItem = ({scroll, message, currentUser}) => {

    return (
        <>
            <div ref={scroll} key={message.id}
                 className={
                     message.senderId === currentUser
                         ? "message own"
                         : "message"
                 }
            >
                <span>{message.user.name} {message.user.surname}</span>{" "}
                <span>{message.content}</span>{" "}
                <span>{format(message.createdAt)}</span>
            </div>
        </>
    );
};

export default observer(MessageItem);
