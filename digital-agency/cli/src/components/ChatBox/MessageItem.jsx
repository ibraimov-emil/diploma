import React, {useContext, useState} from "react";
import { useEffect } from "react";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
import {format} from "timeago.js";
const MessageItem = ({scroll, message, currentUser}) => {

    const [userData, setUserData] = useState(null)
    const {user} = useContext(AuthContext)


    // useEffect(()=> {
    //
    //     const userId = data.members.find((id)=>id!==currentUser)
    //     const getUserData = async ()=> {
    //         try
    //         {
    //             const {data} = await getUser(userId)
    //             setUserData(data)
    //             dispatch({type:"SAVE_USER", data:data})
    //         }
    //         catch(error)
    //         {
    //             console.log(error)
    //         }
    //     }
    //
    //     getUserData();
    // }, [])

    // useEffect(()=> {
    //   const userId = data.members.find((id)=>id!==currentUser)
    // }, [])

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
