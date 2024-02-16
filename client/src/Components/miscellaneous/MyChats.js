import { React,useEffect,useState} from 'react';
import { ChatState } from "../../Context/ChatProvider";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import { getSender } from "../../config/chatLogics";
import ChatLoading from '../userAvatar/ChatLoading';
import GroupChatModal from './GroupChatModal';
import { URL } from '../../services/helper';

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState({});
  const { setSidePanel, chats, setChats, selectedChat,setSelectedChat,chatModal,setChatModal,fetchAgain,setFetchAgain } = ChatState();
  
  const userData = useSelector((state) => state.user);

  const fetchChats = async() => {
      const config = {
        headers: {
          Authorization:`Bearer ${userData.token}`
        }
      }
      const { data } = await axios.get(`${URL}/api/chat`, config);
    const mySet = new Set(data);
    setChats(Array.from(mySet));
  }
  useEffect(() => {
    setLoggedUser(userData);
    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <div
        onClick={() => setSidePanel(false)}
        className={`bg-white mt-3 ml-3 rounded h-auto p-2 messages ${
          selectedChat ? "chats" : "max-sm:block w-full"
        }  md:block md:w-3/12 xl:w-4/12`}
      >
        <div className="flex justify-between">
          <h1 className="text-3xl font-sans text-slate-400">My Chats</h1>
          <div
            className="flex items-center cursor-pointer bg-slate-200 rounded p-1"
            onClick={() => setChatModal(true)}
          >
            <p>New Group Chat</p>
            <FaPlus className="p-1 text-2xl" />
          </div>
        </div>
        {chatModal && <GroupChatModal setFetchAgain={setFetchAgain} />}
        <div>
          {chats ? (
            <div>
              {chats.map((chat) => {
                // if (chats.includes(chat)) {
                //   return;
                // }
                return (
                  <div
                    className="bg-green-200 cursor-pointer rounded p-2 mt-2 "
                    onClick={() => setSelectedChat(chat)}
                    key={chat._id}
                  >
                    <h1>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </h1>
                  </div>
                );
              })}
            </div>
          ) : (
            <ChatLoading />
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default MyChats