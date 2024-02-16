import { React,useEffect,useState} from 'react';
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../Components/miscellaneous/SideDrawer";
import MyChats from "../Components/miscellaneous/MyChats";
import ChatBox from "../Components/miscellaneous/ChatBox";
import { ChatState } from "../Context/ChatProvider";

const Chat = () => {
  const [chats, setChats] = useState([]);
  

  const navigate = useNavigate();
  
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    if (userData.name==="") {
      navigate("/");
    }
    return;
  }, []);
    
    return (
      <>
        {userData.name !== "" && (
          <div className="w-full app">
            <SideDrawer />
            <div className="flex gap-1 h-5/6">
              <MyChats  />
              <ChatBox  />
            </div>
          </div>
        )}
      </>
    );
}

export default Chat