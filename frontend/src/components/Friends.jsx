import React, { useEffect, useState} from 'react'
import { RiUserUnfollowFill } from "react-icons/ri";
import useUnfriend from '../hooks/useUnfriend';

function Friends() {
  const [friends, setFriends] = useState([]);
  const {loading, removeFriend} = useUnfriend();

  const handleRemove = async (id) => {
    await removeFriend(id);
  }

  useEffect(() => {
    const fetchedFriends = async() => {
      try {
        const res = await fetch("/api/request/friends")

        const data = await res.json();
        setFriends(data)
      } catch (error) {
        console.log("Error while fetching friends");
      }
    }

    fetchedFriends();
  }, [friends, setFriends])

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h2 className='text-base md:text-xl font-semibold mb-6'>Friends</h2>
      {friends.length > 0 ? (
        <ul className="space-y-4">
          {friends.map((friend) => (
            <li key={friend._id} className='flex items-center justify-between border rounded-xl shadow-md p-4'>
              <span className='text-base sm:text-lg truncate flex-grow'>{friend.fullname}</span>
              <button 
                className='ml-4 p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors'
                onClick={() => handleRemove(friend._id)}
                disabled={loading}
                aria-label={`Remove ${friend.fullname}`}
              >
                <RiUserUnfollowFill className="text-xl" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No friends found.</p>
      )}
    </div>
  )
}

export default Friends;