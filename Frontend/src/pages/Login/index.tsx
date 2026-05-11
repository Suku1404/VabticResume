// import Login from "./Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { SubmitEvent } from "react";



const logic =() => {
const navigate = useNavigate();
const handleSubmit  = async (e:SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

      try {
        const res = await axios.post("http://localhost:3000/api/auth/user/login",{
            email,
            password
        },{
            withCredentials:true
        })
        navigate("/dashboard")
      } catch (error:any) {
        console.log("Error res:", error.response?.data)
      }
  } 
}
  export default logic;

