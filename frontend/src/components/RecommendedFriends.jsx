import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import useSendRequest from '../hooks/useSendRequest';

function Recommended() {

    const [loading, setLoading] = useState(false);
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const {sendRequest} = useSendRequest();

    const getSuggestedFriends = async() => {
        setLoading(true)
        try {
            const res = await fetch("/api/request/suggest")

            const data = await res.json();
            setSuggestedFriends(data)
        } catch (error) {
            console.log("Error while fetching suggested friends", error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getSuggestedFriends();
    }, [])

    const handleSendRequest = async(id) => {
        await sendRequest(id);       
        setSuggestedFriends(suggestedFriends.filter(user => user._id !== id))
    }

  return (
    <div className='flex flex-col mt-10'>
        <h1 className='md:text-xl text-base mb-4 text-center'>Recommended Friends</h1>
        <ul>
          {
            loading ? <div className='loading loading-spinner'></div> : (suggestedFriends.map((friend) => (
              <div key={friend._id} >
                <div className='flex flex-row justify-between border rounded-xl shadow-md mb-4 p-2 md:p-3'>
                  <li className='text-lg'>{friend.fullname}</li>
                  <button 
                    className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors'
                    onClick={() => handleSendRequest(friend._id)}
                  >
                    <IoIosSend className='text-xl' />
                  </button>
                </div>
              </div>
                )))
          }
        </ul>
    </div>
  )
}

export default Recommended