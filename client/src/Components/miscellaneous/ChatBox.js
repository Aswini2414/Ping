import React from 'react';
import { ChatState } from "../../Context/ChatProvider";
import SingleChat from './SingleChat';

const ChatBox = () => {
  const { sidePanel, setSidePanel, selectedChat } = ChatState();
  return (
    <>
      <div
        onClick={() => setSidePanel(false)}
        className={`mt-3 rounded bg-white  ${
          selectedChat ? "max-sm:block w-full" : "max-sm:hidden"
        } md:block  md:w-9/12 xl:w-8/12`}
      >
        <SingleChat  />
      </div>
    </>
  );

}

export default ChatBox