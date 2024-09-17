import React from 'react'
import { IoLogOut } from "react-icons/io5";
import { useAuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

function Logout() {
    const {setAuthUser} = useAuthContext();

    const handleLogout = () => {
        try {
            fetch("/api/auth/logout", {
                method:"POST"
            })

            localStorage.removeItem("user");
            setAuthUser(null);
            toast.success("User logged out safely");
        } catch (error) {
            console.log("Error while logging out", error);
        }
    }

  return (
    <div className='cursor-pointer'>
        <IoLogOut onClick={handleLogout}/>
    </div>
  )
}

export default Logout