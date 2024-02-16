import React from "react";
import { FaX } from "react-icons/fa6";
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";

const ProfileModel = ({user}) => {
  const { userprofile, setUserProfile,chatProfile,setChatProfile } = ChatState();
  // const userData = useSelector((state) => state.user);

  return (
    <>
      <div className="absolute top-1/4 left-10 bg-white rounded flex-col p-1 text-3xl shadow-md drop-shadow-md w-3/4 h-2/4 md:w-1/4 md:h-2/4 md:left-1/3">
        <FaX
          className="text-xl ml-auto rounded-full cursor-pointer mr-2 mt-2"
          onClick={() => {
            setUserProfile(false);
            setChatProfile(false);
          }}
        />
        <img
          src={
            user.image
              ? user.image
              : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLbOasrP2azsdMM1tvCRXeHVcSPK0kV1WfA&usqp=CAU"
          }
          className="w-1/2 h-3/5 rounded-full ml-auto mr-auto scale-100"
        />
        <h1 className="m-2 mt-4 text-center capitalize text-lg md:text-xl">{user.name}</h1>
        <h1 className="text-center text-lg  md:text-xl">{user.email}</h1>
      </div>
    </>
  );
};

export default ProfileModel;
