import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth } from "../firebase";

export default function SignUpGoogle() {
    function googleLogin()
    {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth,provider).then(async(result)=>{
            console.log(result);
            
        });
    }
  return (
    <div>
        <p> -- Or continue with -- </p>
        <button onClick={googleLogin}>Sign Up with Google</button>
    </div>
  )
}
