import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {auth , db} from '../firebase';
import { toast } from "react-toastify";
import SignUpGoogle from './SignUpGoogle';
import { Link , useNavigate } from "react-router-dom";
import { setDoc , doc } from "firebase/firestore";
import '../App.css'
import ThreeBackground from "./ThreeBackground";
export default function SignUp() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState(""); 

    const navigate = useNavigate();

    const handleRegister= async(e)=>{
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;

            if(user)
            {
                await setDoc(doc(db,"Users",user.uid),{
                    email: user.email,
                    name: name
                });
            }
            toast.success("User is Registered");
            console.log("User registered succesfully");
            navigate("/");
        } catch (error) {
            // toast.error(`User not registered ${error.message}`);
            console.log(error.message);
        }
    }
  return (
    <div>
        <ThreeBackground/>
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
        <SignUpGoogle/>
        <h4>Already have an account? <Link to='/'>Login</Link></h4>
        </form>
    </div>
  )
}
