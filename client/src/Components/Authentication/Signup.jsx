import { React,useState} from 'react';
import { Link,useNavigate} from "react-router-dom";
import { ImagetoBase64 } from '../../utility/ImagetoBase64.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { BarLoader } from "react-spinners";
import { URL } from "../../services/helper.js";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [image, setImage] = useState("");
  const [show, setShow] = useState(false);
  const [conshow, setConShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleImageUpload = async(e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    setImage(data);
  }

  const handleClick = async(e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: name,
      email: email,
      password: password,
      confirm: confirm,
      image: image,
    };
    if (data.password === data.confirm) {
      const response = await axios.post(
        `${URL}/api/user/`,
        data
      );
      if (response.status === 201) {
        toast.success(
          "Registration successful!,Press Login button to log into app"
        );
        setLoading(false);
        setName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setImage("");
      } else {
        setLoading(false);
        toast.error("Registration Unsuccessful");
      }
    } else {
      setLoading(false);
      toast.error("Password and confirm password are not same")
    }
    
  }
  return (
    <>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Name <span className="text-red-500 text-lg">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Your Name"
          className="outline-none shadow-md drop-shadow p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Email <span className="text-red-500 text-lg">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Your Email"
          className="outline-none shadow-md drop-shadow p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Password <span className="text-red-500 text-lg">*</span>
        </label>
        <div className="flex justify-between shadow-md drop-shadow">
          <input
            type={show ? "text" : "password"}
            placeholder="Enter Your Password"
            className="outline-none p-2 w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="bg-teal-200 hover:bg-teal-400 px-4 rounded"
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">
          Confirm Password <span className="text-red-500 text-lg">*</span>
        </label>
        <div className="flex justify-between shadow-md drop-shadow">
          <input
            type={conshow ? "text" : "password"}
            placeholder="Confirm password"
            className="outline-none p-2 w-full"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            className="bg-teal-200 hover:bg-teal-400 px-4 rounded"
            onClick={() => setConShow(!conshow)}
          >
            {conshow ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-col text-lg gap-2">
        <label className="font-semibold">Upload your picture</label>
        <input
          className="outline-none shadow-md drop-shadow p-2"
          type="file"
          placeholder="No file chosen"
          value={image}
          onChange={(e) => handleImageUpload(e)}
          accept="image/*"
        />
      </div>
      <button
        className="mt-5 text-lg bg-teal-200  w-full text-center rounded py-2 hover:bg-teal-400 font-semibold"
        onClick={(e) => handleClick(e)}
      >
        Sign Up
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

export default Signup