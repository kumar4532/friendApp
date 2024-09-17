import React, { useState } from 'react'
import { useAuthContext } from '../context/AuthContext';

function useUnfriend() {
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const userId = authUser._id;

  const removeFriend = async(id) => {
    setLoading(true)
    try {
        const res = await fetch(`/api/request/friend/${id}`, {
            method: "DELETE",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({id, userId})
        })

        const data = await res.json();

        console.log(data);
    } catch (error) {
        console.log("Error while removing friend");
    } finally {
        setLoading(false)
    }
  }

  return {
    removeFriend,
    loading
  }
}

export default useUnfriend