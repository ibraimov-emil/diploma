import React, { useEffect, useState } from "react";
import { useRef } from "react";
import "./ChatBox.css";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import {addMessage, getMessages} from "../../services/ChatService";
import {fetchOneUser} from "../../services/UserService";
import {observer} from "mobx-react-lite";
import MessageItem from "./MessageItem";
import {useMutation, useQueryClient} from "react-query";
import {deleteOneProject} from "../../services/ProjectService";

const ChatBox = ({ chat, currentUser, setSendMessage,  receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const handleChange = (newMessage)=> {
    setNewMessage(newMessage)
  }

  // const queryClient = useQueryClient()
  // const sendMessage = (message) => {
  //   try {
  //     // await ProjectService.deleteOneProject(id);
  //     mutation.mutate(message)
  //   } catch (e) {
  //     alert(e)
  //     console.log(e);
  //   }
  // }
  // const mutation = useMutation(message => addMessage(message),
  //     {onSuccess: () => queryClient.invalidateQueries(["messages"])}
  // )

  // fetching data for header
  // useEffect(() => {
  //   // const userId = chat?.members?.find((id) => id !== currentUser);
  //   // const userId = chat?.members?.find((id) => id !== currentUser);
  //   console.log(chat)
  //   const getUserData = async () => {
  //     try {
  //       const { data } = await fetchOneUser(10);
  //       setUserData(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //
  //   if (chat !== null) getUserData();
  //   }, [chat, currentUser]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat.chatId);
        console.log(data)
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);


  // Always scroll to last Message
  useEffect(()=> {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  },[messages])



  // Send Message
  const handleSend = async (e)=> {
    e.preventDefault()
    const message = {
      senderId : currentUser,
      content: newMessage,
      chatId: chat.chatId,
    }

  // setSendMessage({...message})
  // send message to database
  try {
    const { data } = await addMessage(message);
    console.log(chat)
    // const receiverId = chat.members.find((id)=>id!==currentUser);
    // send message to socket server
    // setSendMessage({...message, receiverId})
    setMessages([...messages, data]);

    setNewMessage("");
  }
  catch
  {
    console.log("error")
  }
}

// Receive Message from parent component
useEffect(()=> {
  console.log("Message Arrived: ", receivedMessage)
  if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
    setMessages([...messages, receivedMessage]);
  }

},[receivedMessage])



  const scroll = useRef();
  const imageRef = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div>
                  <img
                    src={
                      userData?.profilePicture
                        ? process.env.REACT_APP_PUBLIC_FOLDER +
                          userData.profilePicture
                        : process.env.REACT_APP_PUBLIC_FOLDER +
                          "defaultProfile.png"
                    }
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "50px", height: "50px" }}
                  />
                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>
                      {chat.chat.name}
                    </span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "20px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body" >
              {messages.map((message) => (
                  <MessageItem
                    key={message.id}
                    scroll={scroll}
                    message={message}
                    currentUser={currentUser}
                  />
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <div onClick={() => imageRef.current.click()}>+</div>
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
              />
              <div className="send-button button" onClick = {newMessage ? handleSend : ''}>Send</div>
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Выберите чат для общения...
          </span>
        )}
      </div>
    </>
  );
};

export default observer(ChatBox);
