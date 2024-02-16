import React from 'react';
import { FaX } from "react-icons/fa6";

const UserBadgeItem = ({ user, handleFunction, admin,main }) => {
  
  return (
    <div className='flex bg-green-400 px-2 justify-between items-center rounded cursor-pointer'>
      <h1 className="text-lg">
        {user.name}
        {(admin || main) === user._id && <span>(Admin)</span>}
      </h1>
      <FaX
        className="text-lg rounded-full bg-white px-1"
        onClick={() => handleFunction()}
      />
    </div>
  );
}

export default UserBadgeItem