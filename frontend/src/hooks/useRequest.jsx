import React from 'react'
import { useAuthContext } from '../context/AuthContext'

function useRequest() {
  const {authUser} = useAuthContext();
  const userId = authUser._id

  const accept = async(id) => {
    try {
        const res = await fetch(`/api/request/accept/${id}`, {
            method:"POST",
            headers: {"content-type": "application-json"},
            body: JSON.stringify({id, userId})
        })

        const data = await res.json();
    } catch (error) {
        console.log("Error while accepting request", error);
    }
  }

  const reject = async(id) => {
    try {
        const res = await fetch(`/api/request/reject/${id}`, {
            method:"POST",
            headers: {"content-type": "application-json"},
            body: JSON.stringify({id, userId})
        })

        const data = await res.json();
    } catch (error) {
        console.log("Error while accepting request", error);
    }
  }

  return {
    accept,
    reject
  }
}

export default useRequest