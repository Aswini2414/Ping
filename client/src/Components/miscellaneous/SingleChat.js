import { React,useState,useEffect} from 'react';
import { ChatState } from '../../Context/ChatProvider';
import { FaChevronLeft } from "react-icons/fa";
import { getSender, getSenderFull } from '../../config/chatLogics';
import { useSelector } from "react-redux";
import { FaRegEye } from "react-icons/fa";
import ProfileModel from './ProfileModel';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import { BarLoader } from 'react-spinners';
import { URL } from "../../services/helper";


const ENDPOINT = URL;
var socket, selectedChatCompare;
const SingleChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [updateGroup, setUpdateGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const {
    selectedChat,
    setSelectedChat,
    chatProfile,
    setChatProfile,
    notification,
    setNotification,
    fetchAgain,
    setFetchAgain,
    typing,
    setTyping,
    count,
    setCount,
    singleChatLoading,
  } = ChatState();
  const userData = useSelector((state) => state.user);


  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `${URL}/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();
      socket.emit("stop typing", selectedChat._id);
      if (!newMessage) {
        toast.error("Enter the message")
      }
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `${URL}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessages([...messages, data]);
        socket.emit("new message", data);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", userData);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.off("typing");
      socket.off("stop typing");
      socket.off("connected");
    }
  });

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    return;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || (selectedChatCompare._id !== newMessageReceived.chat._id)) {
        if (!notification.includes(newMessageReceived)) {
          const countVal = notification.filter((n) => n.chat._id === newMessageReceived.chat._id);
          if (countVal.length > 0) {
            setCount(count)
          } else {
            setCount(count+1)
          }
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setCount(count);
        setMessages((prev) => {
          return [...prev, newMessageReceived]
        });
      }
    });
    return () => {
      socket.off("message received");
    };
  });
  
  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      <div>
        {selectedChat ? (
          <>
            <div className="flex justify-between px-4 py-2">
              <FaChevronLeft
                className="max-sm:flex md:hidden cursor-pointer text-4xl rounded-full bg-slate-200 p-1"
                onClick={() => setSelectedChat("")}
              />
              {!selectedChat.isGroupChat ? (
                <>
                  <div className="flex flex-col">
                    <h1 className="text-xl capitalize">
                      {getSender(userData, selectedChat.users)}
                    </h1>
                    {isTyping && <div>typing...</div>}
                  </div>
                  <FaRegEye
                    className="text-4xl rounded-full p-1 bg-slate-200 cursor-pointer"
                    onClick={() => setChatProfile(!chatProfile)}
                  />
                  {chatProfile && (
                    <ProfileModel
                      user={getSenderFull(userData, selectedChat.users)}
                    />
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-xl capitalize">
                    {selectedChat.chatName}
                  </h1>
                  <FaRegEye
                    className="text-4xl rounded-full p-1 bg-slate-200 cursor-pointer"
                    onClick={() => setUpdateGroup(!updateGroup)}
                  />
                </>
              )}
            </div>
            {updateGroup && (
              <UpdateGroupChatModal
                setUpdateGroup={setUpdateGroup}
                fetchMessages={fetchMessages}
              />
            )}
            <div className="flex flex-col justify-end h-[75vh] w-full bg-slate-400 p-3 rounded">
              {loading ? (
                <div className="text-center text-2xl">Loading...</div>
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}
              <form
                tabIndex={0}
                onKeyDown={(e) => sendMessage(e)}
                className="mt-3"
              >
                <input
                  type="text"
                  value={newMessage}
                  placeholder="Enter a message..."
                  onChange={(e) => typingHandler(e)}
                  className="w-full rounded px-2 py-1 outline-none text-xl active:outline-rose-600 focus:outline-rose-600"
                />
              </form>
            </div>
          </>
        ) : (
          <>
            {singleChatLoading ? (
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
            ) : (
              <div className="flex flex-col justify-center items-center h-[80vh]">
                <h1 className="text-3xl">Click on a user to start chatting</h1>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default SingleChat