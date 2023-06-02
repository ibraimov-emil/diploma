import React, {useContext, useRef, useState} from "react";
import ChatBox from "../../components/ChatBox/ChatBox";
import Conversation from "../../components/Coversation/Conversation";
import "./Chat.css";
import { useEffect } from "react";

import { io } from "socket.io-client";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
import {userChats} from "../../services/ChatService";
import {useQuery} from "react-query";
import {fetchClients} from "../../services/ClientService";
import {SocketContext} from "../../contexts/SocketContext";

const Chat = () => {
  const socket = useContext(SocketContext);
  // const socket = useRef();
  const {user} = useContext(AuthContext)
  console.log(user.User.id)

  // const [chats, setChat] = useState([])


  const [onlineUsers, setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);

  const {data: chats, isLoading, isError} = useQuery('chats', userChats)
  // Get the chat in chat section

  console.log(chats)
  // Connect to Socket.io
  // useEffect(() => {
  //   // socket.current = io("ws://localhost:5000");
  //   socket.emit("new-user-add", user.id);
  //   socket.on("get-users", (users) => {
  //     setOnlineUsers(users);
  //   });
  // }, [user]);

  // Send Message to socket server
  useEffect(() => {
    if (sendMessage!==null) {
      // socket.current = io("ws://localhost:5000");
      socket.emit("send-message", sendMessage);}
  }, [sendMessage]);


  // Get the message from socket server
  // useEffect(() => {
  //   socket.current.on("recieve-message", (data) => {
  //     console.log(data)
  //     setReceivedMessage(data);
  //   }
  //
  //   );
  // }, []);


  // const checkOnlineStatus = (chat) => {
  //   const chatMember = chat.members.find((member) => member !== user._id);
  //   const online = onlineUsers.find((user) => user.userId === chatMember);
  //   return online ? true : false;
  // };

  if (isLoading){
    return <div>Загрузка...</div>
  }

  if (isError){
    return <div>Ошибка...</div>
  }

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        {/*<LogoSearch />*/}
        <div className="Chat-container">
          <h2>Чаты</h2>
          <div className="Chat-list">
            {chats.map((chat) => (
              <div key={chat.chat.id}
                onClick={() => {
                  setCurrentChat(chat);
                }}
              >
                <Conversation key={chat.chat.id}
                  data={chat}
                  currentChat={chat.chat.name}
                  // online={checkOnlineStatus(chat)}
                  online={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          {/*<NavIcons />*/}
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user.User.id}
          setSendMessage={setSendMessage}
          receivedMessage={receivedMessage}
        />
      </div>
    </div>
  );
};

export default observer(Chat);
