import React, {useContext, useState} from "react";
import { useEffect } from "react";
import {observer} from "mobx-react-lite";
import {AuthContext} from "../../contexts/authContext";
const Conversation = ({ data, currentUser, online }) => {

  const [userData, setUserData] = useState(null)
  const {user} = useContext(AuthContext)


  // useEffect(()=> {
  //   const userId = data.members.find((id)=>id!==currentUser)
  // }, [])

  return (
    <>
      <div className="follower conversation">
        <div>
          {online && <div className="online-dot"></div>}
          {/*<img*/}
          {/*  src={userData?.profilePicture? process.env.REACT_APP_PUBLIC_FOLDER + userData.profilePicture : process.env.REACT_APP_PUBLIC_FOLDER + "defaultProfile.png"}*/}
          {/*  alt="Profile"*/}
          {/*  className="followerImage"*/}
          {/*  style={{ width: "50px", height: "50px" }}*/}
          {/*/>*/}
          <div className="name" style={{fontSize: '0.8rem'}}>
            <span>{user.User?.name} {user.User?.surname}</span>
            <span style={{color: online?"#51e200":""}}>{online? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.1px solid #ececec" }} />
    </>
  );
};

export default observer(Conversation);
