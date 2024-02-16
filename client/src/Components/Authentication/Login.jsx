import { React, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginRedux } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';
import { URL } from "../../services/helper.js";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = async(e) => {
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast.error("Enter all the details");
      return;
    }
    try {
      const data = {
        email: email,
        password: password,
      };
      console.log(data);
      const res = await axios.post(`${URL}/api/user/login`, data);
      console.log(res);
      dispatch(loginRedux(res.data));
      if (res.status === 200) {
        setLoading(false);
        toast.success("Login Successful🎉");
        
        setTimeout(() => {
          navigate("/chats");
        })
      } else {
        setLoading(false);
        toast.error("Login Unsuccessful☹")
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };
  return (
    <>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Email <span className="text-red-500 text-lg">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Enter Your Email"
          className="outline-none shadow-md drop-shadow p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Password <span className="text-red-500 text-lg">*</span>
        </label>
        <div className="flex justify-between shadow-md drop-shadow">
          <input
            type={show ? "text" : "password"}
            required
            placeholder="Enter Your Password"
            className="outline-none p-2 w-full"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="bg-teal-200 hover:bg-teal-400 px-4 rounded"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      <button
        className="mt-5 text-lg bg-teal-200  w-full text-center rounded py-2 hover:bg-teal-400 font-semibold"
        onClick={(e) => handleClick(e)}
      >
        Log in
      </button>

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
      <ToastContainer />
    </>
  );
}

export default Login