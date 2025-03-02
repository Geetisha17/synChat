import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {auth} from '../firebase';
import { toast } from "react-toastify";
import SighUpGoogle from "./SignUpGoogle";

export default function SignUp() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState(""); 

    const handleRegister= async(e)=>{
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth,email,password);
            const user = auth.currentUser;
            console.log(user);
            console.log("User registered succesfully");
            toast.success("User is Registered");
        } catch (error) {
            toast.error("User not registered");
            console.log(error.message);
        }
    }
  return (
    <div>
        <form onSubmit={handleRegister}>
            <h3>Sign Up</h3>
            <div>
                <label>Name</label>
                <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e)=>setName(e.target.value)}
                />
            </div>
            <div>
        <label>Email</label>
        <input
        type="email"
        className="email"
        placeholder="Enter your mail"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        </div>
        <div>
            <label>Password</label>
            <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
        </div>
        <div>
            <button type="submit">Submit</button>
        </div>
        <SighUpGoogle/>
        </form>
    </div>
  )
}
