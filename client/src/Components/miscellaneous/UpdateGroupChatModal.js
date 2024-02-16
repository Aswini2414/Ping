import { React,useState} from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { FaX } from "react-icons/fa6";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import UserListItem from '../userAvatar/UserListItem';
import { BarLoader } from 'react-spinners';
import { URL } from '../../services/helper';

const UpdateGroupChatModal = ({  setUpdateGroup,fetchMessages }) => {
  const [loading, setLoading] = useState();
  const [groupUpdate, setGroupUpdate] = useState(false);
  const [groupchatName, setGroupChatName] = useState("");
  const [renameLoading, setRenameLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const { selectedChat,setSelectedChat, profile, setProfile,fetchAgain,setFetchAgain } = ChatState();
  const userData = useSelector((state) => state.user);
  
  const handleRemove = async(user) => {
    setLoading(true);
    const config = {
      headers: {
        Authorization:`Bearer ${userData.token}`
      }
    }

    const { data } = await axios.put(`${URL}/api/chat/groupremove`, {
      chatId: selectedChat._id,
      userId:user._id
    }, config);
    
    user._id === userData._id ? setSelectedChat("") : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
    fetchMessages();
    toast.success("Group removed! ");
  }

  const handleDeleteUser = async(user) => {
    try {
      if (userData._id === (selectedChat.groupAdmin || selectedChat.groupAdmin?._id)) {
        console.log(
          userData._id ==
            (selectedChat.groupAdmin || selectedChat.groupAdmin?._id)
        );
        setLoading(true);
    const config = {
      headers: {
        Authorization:`Bearer ${userData.token}`
      }
    }

    const { data } = await axios.put(`${URL}/api/chat/groupremove`, {
      chatId: selectedChat._id,
      userId:user._id
    }, config);
    
    user._id === userData._id ? setSelectedChat("") : setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
    fetchMessages();
    toast.success("User removed! ");
    } else {
        toast.error("Only admins can remove someone");
    }
    } catch (error) {
      toast.error(error.message);
    }
  }
  
  const handleRename = async(e) => {
    e.preventDefault();
    setGroupUpdate(true);
    if (!groupchatName) {
      toast.error("Enter the chat name!")
    }
    setRenameLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`
      }
    };
    const { data } = await axios.put(`${URL}/api/chat/rename`, {
      chatId: selectedChat._id,
      chatName: groupchatName
    }, config);
    
    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setRenameLoading(false);
    setUpdateGroup(false);
    setGroupUpdate(false);
  }

  const handleSearch = async(query) => {
    setSearch(query);
    setLoading(true);
    const config = {
      headers: {
        Authorization : `Bearer ${userData.token}`
      }
    }

    const { data } = await axios.get(`${URL}/api/user?search=${search}`, config);
    
    setLoading(false);
    setSearchResult(data);
    setSearch("");
  }

  const handleAddUser = async (user) => {
    setGroupUpdate(true)
    if (selectedChat.users.find((u) => u._id === user._id)) {
      toast.error("User already in group!");
      return;
    }

    if (
      (selectedChat.groupAdmin || selectedChat.groupAdmin?._id) !== userData._id
    ) {
      toast.error("Only admins can add someone!");
      return;
    }
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    const { data } = await axios.put(
      `${URL}/api/chat/groupadd`, {
        chatId: selectedChat._id,
        userId:user._id
      },
      config
    );

    setSelectedChat(data);
    setFetchAgain(!fetchAgain);
    setLoading(false);
    setGroupUpdate(false);
    toast.success("User added");
  }
  return (
    <>
      <div className="absolute top-1/5 left-10 bg-white rounded flex-col py-3 text-3xl md:w-1/3 shadow-md drop-shadow-md overflow-x-scroll scrollbar-none scroll-smooth scrollbar md:left-1/3">
        <FaX
          className="text-xl ml-auto rounded-full cursor-pointer mr-2 mt-2"
          onClick={() => setUpdateGroup(false)}
        />
        <h1 className="text-center text-2xl mb-2 font-bold font-mono">
          {selectedChat.chatName}
        </h1>
        <div className="flex flex-col items-center mt-8 font-mono">
          <div className="flex gap-1">
            {selectedChat.users.map((u) => {
              return (
                <div key={u._id}>
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    main={selectedChat.groupAdmin}
                    admin={selectedChat.groupAdmin?._id}
                    handleFunction={() => handleDeleteUser(u)}
                  />
                </div>
              );
            })}
          </div>
          <form className="mt-5">
            <div className="flex gap-2 justify-center items-center  ">
              <input
                placeholder="Chat Name"
                className="mb-3 mt-3 px-2 max-w-2/4 text-lg font-mono outline-none active:outline-green-400 cursor-pointer focus:outline-green-400 rounded"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <button
                className="rounded px-2 py-1 text-xl text-center bg-purple-500 shadow-md drop-shadow-md font-medium text-white font-mono hover:bg-pink-400"
                onClick={(e) => handleRename(e)}
              >
                Update
              </button>
            </div>
            <div>
              <input
                placeholder="Add User to the Group"
                onChange={(e) => handleSearch(e.target.value)}
                className="mb-3 mt-3 w-full px-2 text-lg font-mono outline-none active:outline-green-400 cursor-pointer focus:outline-green-400 rounded"
              />
            </div>
            {loading ? (
              <div className="text-center text-xl">Loading...</div>
            ) : (
              <div className="bg-green-400 rounded shadow-md drop-shadow-md px-2 py-1 text-xl">
                {searchResult?.slice(0, 4).map((user) => {
                  return (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  );
                })}
              </div>
            )}
            <div className="flex w-full">
              <button
                className="text-xl mt-3 bg-red-400 px-2 py-1 rounded text-white ml-auto hover:bg-red-700"
                onClick={() => handleRemove(userData)}
              >
                Leave Group
              </button>
            </div>
          </form>
        </div>
        {groupUpdate && (
          <div className="flex items-center justify-center">
            <h1
              style={{
                color: "#e64980",
                marginTop: "2rem",
                marginBottom: "2rem",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Loading....
            </h1>
            <BarLoader
              textalign={"center"}
              color={"#e64980"}
              loading={loading}
              height={4}
              width={100}
              radius={4}
            />
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default UpdateGroupChatModal
