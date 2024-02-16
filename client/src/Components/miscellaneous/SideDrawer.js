import { React,useState,useEffect} from 'react';
import { FaSearch, FaBell, FaRegUserCircle, FaAngleDown } from "react-icons/fa";
import ProfileModel from './ProfileModel';
import { ChatState } from "../../Context/ChatProvider";
import { logoutRedux } from '../../redux/userSlice';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ChatLoading from '../userAvatar/ChatLoading';
import UserListItem from '../userAvatar/UserListItem';
import { getSender } from '../../config/chatLogics';
import { GoDotFill } from "react-icons/go";
import { BarLoader } from 'react-spinners';
import { URL } from '../../services/helper';

const SideDrawer = () => {
  const [clicked, setClicked] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [notified, setNotified] = useState(false);
  const {
    singleChatLoading,
    setSingleChatLoading,userprofile,
    setUserProfile,
    sidePanel,
    setSidePanel,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
    count,
    setCount,
  } = ChatState();


  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  

  const logOut = () => {
    dispatch(logoutRedux());
      navigate("/");
  }

  const handlePanel = (e) => {
    e.preventDefault();
    console.log("hi");
    setSidePanel(!sidePanel);
  }

  const handleSearch = async(e) => {
    e.preventDefault();
    if (!search) {
      toast.error("Please Enter something in search");
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`
        },
      };
      const { data } = await axios.get(`${URL}/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Failed to Load the Search Results")
    }
  }

  const accessChat = async(userId) => {
    try {
      setSingleChatLoading(true);
      for (let i = 0; i < chats.length; i++) {
        for (let j = 0; j < chats[i].users.length; j++) {
          if (chats[i].users[j]._id == userId || chats[i].users[chats[i].users.length - 1]._id == userId) {
            if (chats[i].users[j]._id == userData._id || chats[i].users[chats[i].users.length - 1]._id == userData._id) {
              setSelectedChat(chats[i]);
              setSearch("");
              setSearchResult([]);
              setSidePanel(false);
            }
            
          }
        }
        return;
      }
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${userData.token}`
        }
      };

      const { data } = await axios.post(`${URL}/api/chat`, { userId }, config);
      
      if (!chats.find((c) => c._id === data.id)) {
        setChats([data, ...chats]);
      }
      setLoadingChat(false);
      setSelectedChat(data);
      setSearch("");
      setSearchResult([]);
      setSidePanel(false);
    } catch (error) {
      toast.error(error.message);
    }
  }


  return (
    <div>
      <div className="bg-white flex items-center p-4 justify-between">
        <button onClick={(e) => handlePanel(e)}>
          <div className="flex gap-2 bg-white hover:bg-slate-200 rounded p-1 ">
            <FaSearch className=" mt-2 cursor-pointer max-xs:text-xl md:text-3xl" />
            <input
              type="text"
              placeholder="Search User"
              className="p-1 outline-none hover:bg-slate-200 rounded w-20 max-xs:text-md md:text-xl md:w-full"
            />
          </div>
        </button>
        <h1 className="font-semibold text-slate-400 max-xs:text-xl md:text-2xl">
          Ping
        </h1>
        <div className="flex gap-9 items-center ml-2">
          <FaBell className="cursor-pointer max-xs:text-2xl md:text-3xl" />
          <div
            className="absolute bg-red-400 rounded-full  text-white px-1 cursor-pointer ml-4 mb-6"
            onClick={() => setNotified(!notified)}
          >
            {count}
          </div>
          <div>
            {notified &&
              (count == 0 ? (
                <h1 className="absolute top-20 left-2/4 w-full  bg-white  rounded p-2 flex items-center gap-1 text-slate-400md:left-3/4 ">
                  <span className="text-red-400">
                    <GoDotFill />
                  </span>
                  No New Messages
                </h1>
              ) : (
                <div className="absolute top-20 w-full left-2/4 bg-white rounded p-2 md:left-3/4">
                  {notification.map((notif, index) => {
                    return (
                      <div
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(
                            notification.filter((n) => n !== notif)
                          );
                          setCount(count - 1);
                          setNotified(false);
                        }}
                        className="cursor-pointer text-xl font-medium mb-2"
                      >
                        {notif.chat.isGroupChat ? (
                          <div className="flex items-center gap-1 text-slate-400">
                            <span className="text-red-400">
                              <GoDotFill />
                            </span>
                            {`New Message in ${notif.chat.chatName}`}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400">
                            <span className="text-red-400">
                              <GoDotFill />
                            </span>
                            {`New Message from ${getSender(
                              userData,
                              notif.chat.users
                            )}`}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
          </div>

          <div className="flex items-center gap-1 cursor-pointer md:gap-2">
            {userData.image ? (
              <img
                src={userData.image}
                className="w-10 h-10 rounded-full shadow-md drop-shadow-md scale-100 opacity-100"
                onClick={() => setClicked(!clicked)}
              />
            ) : (
              <FaRegUserCircle
                onClick={() => setClicked(!clicked)}
                className="text-5xl drop-shadow shadow-lg rounded-full"
              />
            )}
          </div>
          {clicked && (
            <div className="absolute top-12 h-[100px] w-[150px] mt-7 right-2 bg-white p-1 shadow-md drop-shadow-md rounded flex-col items-center text-center cursor-pointer">
              <h2
                className="p-1 pt-4 text-lg"
                onClick={() => {
                  setUserProfile(!userprofile);
                  setClicked(!clicked);
                }}
              >
                My Profile
              </h2>
              <h2 className="p-1 text-lg" onClick={() => logOut()}>
                Log Out
              </h2>
            </div>
          )}
        </div>
      </div>
      {userprofile && (
        <div>
          <ProfileModel user={userData} />
        </div>
      )}

      {sidePanel && (
        <div className="absolute top-0 left-0 h-full w-3/5 bg-white p-2 rounded md:w-2/6">
          <h1 className="text-center mt-3  mb-3 font-semibold text-lg">
            Search Users
          </h1>
          <div className="flex w-full ml-auto gap-2 mb-5 md:w-full">
            <input
              type="text"
              className="outline-none text-lg pl-2 pr-2 active:outline-blue-400 rounded focus:outline-blue-400 w-2/3 md:w-full"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="bg-slate-300 w-1/3 rounded text-lg font-medium pl-2 pr-2 md:w-auto"
              onClick={(e) => handleSearch(e)}
            >
              Go
            </button>
          </div>
          {loading ? (
            <div className="text-center">
              {loading && (
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
          ) : (
            searchResult?.map((user) => {
              return (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              );
            })
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default SideDrawer