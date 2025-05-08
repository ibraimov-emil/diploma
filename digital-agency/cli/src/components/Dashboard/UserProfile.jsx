import React, { useContext } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { Button } from ".";
import { userProfileData } from "../../data/dummy";
import { useStateContext } from "../../contexts/ContextProvider";
import avatar from "../../data/avatar123.jpg";
import { observer } from "mobx-react-lite";
import { AuthContext } from "../../contexts/authContext";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { currentColor, setIsClicked } = useStateContext();

  async function logout() {
    try {
      console.log("logout");
      await user.logout();
      console.log("logouttrue");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  }

  // Handle click on profile items
  const handleProfileItemClick = (item) => {
    // Close the user profile dropdown
    setIsClicked((prevState) => ({ ...prevState, userProfile: false }));
    
    // For now, just log the item as these don't have actual routes yet
    console.log(`Clicked on ${item.title}`);
    
    // If you want to navigate to a specific route based on the item
    // you can add handling here when routes are available
    if (item.title === 'My Profile') {
      navigate('/myProfile');
    }
  };

  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Профиль пользователя</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
          onClick={() => setIsClicked((prevState) => ({ ...prevState, userProfile: false }))}
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={avatar}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">
            {" "}
            {user.User.name} {user.User.surname}{" "}
          </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">
            {" "}
            {
              user.User.employee ? (
                <>
                Сотрудник
                </>
              ) : (
                <>
                Клиент
                </>
              )
            }
            {" "}
          </p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">
            {" "}
            {user.User.email}{" "}
          </p>
        </div>
      </div>
      <div>
        {userProfileData.map((item, index) => (
          <div
            onClick={() => handleProfileItemClick(item)}
            key={index}
            className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer dark:hover:bg-[#42464D]"
          >
            <div
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="text-xl rounded-lg p-3 hover:bg-light-gray"
            >
              {item.icon}
            </div>
            <div>
              <p className="font-semibold dark:text-gray-200">{item.title}</p>
              <p className="text-gray-500 text-sm dark:text-gray-400">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div onClick={logout} className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="Выйти"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>
  );
};

export default observer(UserProfile);
