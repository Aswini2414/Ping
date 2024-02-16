import { React, createContext,useContext,useState} from 'react';


const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [userprofile, setUserProfile] = useState(false);
  const [chatProfile, setChatProfile] = useState(false);
  const [sidePanel, setSidePanel] = useState(false);
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [chatModal, setChatModal] = useState(false);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [notification, setNotification] = useState([]);
  const [typing, setTyping] = useState(false);
  const [count, setCount] = useState(0);
  const [singleChatLoading, setSingleChatLoading] = useState(false);
  return (
    <chatContext.Provider
      value={{
        userprofile,
        setUserProfile,
        chatProfile,
        setChatProfile,
        sidePanel,
        setSidePanel,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        chatModal,
        setChatModal,
        fetchAgain,
        setFetchAgain,
        notification,
        setNotification,
        typing,
        setTyping,
        count,
        setCount,
        singleChatLoading,
        setSingleChatLoading,
      }}
    >
      {children}
    </chatContext.Provider>
  );
}

export const ChatState = () => {
    return useContext(chatContext);
}

export default ChatProvider;