import React from 'react'
import { useAuthContext } from "../context/AuthContext"
import toast from 'react-hot-toast';

function useSendRequest() {
    const {authUser} = useAuthContext();
    const userId = authUser._id

    const sendRequest = async(id) => {
        try {
            const res = await fetch(`/api/request/send/${id}`, {
                method:"POST",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({id, userId})
            })

            const data = await res.json();
            toast.success("Request has been sent")
        } catch (error) {
            console.log("Error while send request", error);
        }
    }

    return {
        sendRequest
    }
}

export default useSendRequest