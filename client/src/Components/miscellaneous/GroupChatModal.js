import { React, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { FaX } from "react-icons/fa6";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import axios from "axios";
import UserListItem from "../userAvatar/UserListItem";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import { BarLoader } from "react-spinners";
import { URL } from "../../services/helper";

const GroupChatModal = ({ setFetchAgain }) => {
  const [groupchatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [create, setCreate] = useState(false);
  const { chatModal, setSelectedChat, setChatModal, chats, setChats } =
    ChatState();

  const userData = useSelector((state) => state.user);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    if (!query) {
      console.log("hi");
      return setLoading(false);
    }
    setSearch(query);
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    const { data } = await axios.get(
      `${URL}/api/user?search=${query}`,
      config
    );
    setLoading(false);
    setSearchResult(data);
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreate(true);
    if (!groupchatName && !selectedUsers) {
      toast.error("Please fill all the details");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    const { data } = await axios.post(
      `${URL}/api/chat/group`,
      {
        name: groupchatName,
        users: selectedUsers,
      },
      config
    );
    setChatModal(false);
    setChats([data, ...chats]);
    setCreate(false);
    setSelectedChat(data);
    toast.success("New Group chat created");
  };
  // useEffect(() => {

  // })
  return (
    <>
      <div className="absolute top-1/4 right-auto left-auto bg-white rounded flex-col py-3 shadow-md drop-shadow-md md:left-1/3">
        <FaX
          className="ml-auto text-lg mr-2 cursor-pointer  rounded-full"
          onClick={() => setChatModal(false)}
        />
        <h1 className="text-center text-3xl mb-10">Create Group Chat</h1>
        <input
          type="text"
          placeholder="Chat Name"
          className=" p-1 w-3/4 ml-10 mb-3 outline-none active:outline-green-400 cursor-pointer focus:outline-green-400 rounded"
          onChange={(e) => setGroupChatName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Add Users Eg:John,Alex"
          className=" p-1 w-3/4 ml-10 mb-3 outline-none active:outline-green-400 cursor-pointer focus:outline-green-400 rounded"
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex z-0 ml-10">
          {selectedUsers.map((u) => {
            return (
              <div key={u._id}>
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="ml-12 bg-green-400 rounded w-3/4 shadow-md drop-shadow-md px-2 py-1">
            {searchResult?.slice(0, 4).map((user) => {
              return (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              );
            })}
          </div>
        )}
        <div className="max-w-[150px] ml-auto z-3">
          <button
            className="bg-green-400 rounded px-2 py-1 text-lg mt-10"
            onClick={(e) => handleSubmit(e)}
          >
            Create Chat
          </button>
        </div>
        {create && (
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
};

export default GroupChatModal;
