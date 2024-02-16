import './App.css';
import Home from "./Pages/Home.jsx";
import Chat from "./Pages/Chat.jsx";
import Login from './Components/Authentication/Login.jsx';
import Signup from './Components/Authentication/Signup.jsx';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="chats" element={<Chat />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
