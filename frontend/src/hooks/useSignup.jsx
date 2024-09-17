import {useState} from 'react'
import toast from 'react-hot-toast';
import { useAuthContext } from '../context/AuthContext'

function useSignup() {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const signup = async ({ fullname, username, password }) => {
        const success = handleInputErrors({ fullname, username, password });
        if (!success) return;   

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, username, password }),
            });

            const data = await res.json();
            
            if (data.error) {
                toast.error("Please enter valid credientilas");
            } else {
                localStorage.setItem("user", JSON.stringify(data));
                setAuthUser(data);
                toast.success("Signed Up Successfully")
            }

        } catch (error) {
            console.log("Error is from catch");
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { loading, signup };
};

export default useSignup;

function handleInputErrors ({fullname, username, password}){
    
    if (!fullname || !username || !password) {
       toast.error("Please fill all the fields"); 
       return false;
    }

    if(password.length < 6){
        toast.error("Password must be at least 6 characters");
        return false;
    }
    return true
}