import { React,useState,useEffect} from 'react';
import Signup from '../Components/Authentication/Signup';
import Login from '../Components/Authentication/Login';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [btn, setBtn] = useState(false);
  const navigate = useNavigate();

  const userData = useSelector((state) => state.user);

  useEffect(() => {
    if (userData.name) {
      navigate("/chats")
    }
  })

  return (
    <>
      <div className="app">
        <div className="w-full max-w-[500px] m-auto ">
          <div className="w-full bg-white rounded py-5">
            <h1 className="text-center text-3xl text-teal-700 font-semibold">
              Ping
            </h1>
          </div>

          <div className="bg-white mt-4 p-8 rounded">
            <div className="w-full flex justify-between ">
              <button
                className="text-center rounded-full  ml-auto mr-auto w-full hover:bg-teal-100 py-1 text-lg"
                onClick={() => setBtn(true)}
              >
                Login
              </button>
              <button
                className="text-center rounded-full ml-auto mr-auto w-full hover:bg-teal-100 py-1 text-lg"
                onClick={() => setBtn(false)}
              >
                Sign Up
              </button>
            </div>
            {btn ? <Login/> : <Signup/>}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home