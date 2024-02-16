import React from 'react';
import { FaUser } from "react-icons/fa6";

const UserListItem = ({user,handleFunction}) => {
  return (
    <div onClick={() => handleFunction()} className="cursor-pointer ">
      <div className="flex gap-3 h-[50px] bg-slate-100  items-center mb-4 hover:bg-green-200 overflow-hidden">
        {user.image ? <img src= {user.image} className="w-8 h-8 rounded-full scale-1"/>:<FaUser className="rounded-full ml-1" />}
        <div className="flex-col">
          <h1>{user.name}</h1>
          <h1>{user.email}</h1>
        </div>
      </div>
    </div>
  );
}

export default UserListItem