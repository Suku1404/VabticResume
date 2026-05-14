// import Login from "./Login";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { SubmitEvent } from "react";

// interface
interface LoginData{
  email:string;
  password:string;
}


const logic =() => {
const navigate = useNavigate();

//  const [error, setError] = useState("");

const handleSubmit  = async (e:SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

      // object with interface
      const LoginForm: LoginData={
        email,
        password,
      };

      try {
        await axios.post("http://localhost:3000/api/auth/user/login",
          LoginForm
          ,{
            withCredentials:true
        })
        navigate("/dashboard")
      } catch (error:any) {
        console.log("Error res:", error.response?.data);
        
      }
  }
 
  return handleSubmit;
    
  
}
  export default logic;

