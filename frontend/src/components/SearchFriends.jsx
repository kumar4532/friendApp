import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";
import useSendRequest from '../hooks/useSendRequest';
import Recommended from './RecommendedFriends';

function SearchFriends() {
    const [input, setInput] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const {sendRequest} = useSendRequest();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/auth/");
                const data = await res.json();
                setAllUsers(data);
            } catch (error) {
                console.error("Error while fetching users", error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const searchUsers = () => {
            const lowerInput = input.toLowerCase();
            const matchedUsers = allUsers.filter(user => 
                user.fullname.toLowerCase().includes(lowerInput)
            );
            setFoundUsers(matchedUsers);
        };

        if (input) {
            searchUsers();
        } else {
            setFoundUsers([]);
        }
    }, [input, allUsers]);
    

    const handleSendRequest = async(id) => {
        await sendRequest(id);
        setSentRequests(prevSentRequests => [...prevSentRequests, id]);
    }
 
  return (
    <div className="w-full max-w-[20rem] mx-auto px-2">
      <label className="input input-bordered flex items-center gap-2 w-full">
        <input
          type="text"
          className="grow w-full"
          placeholder="Search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70 flex-shrink-0"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {input.trim() !== '' && foundUsers.length > 0 && (
        <div className='bg-gray-700 rounded-xl mt-2 text-white w-full'>
          <ul className='p-4'>
            {foundUsers.map((user, idx) => (
              <div key={idx}>
                <div className='flex flex-row justify-between items-center'>
                  <li className="truncate flex-grow">{user.fullname}</li>
                  {!sentRequests.includes(user._id) && (
                        <button 
                          className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors'
                          onClick={() => handleSendRequest(user._id)}
                        >
                          <IoIosSend className='text-xl' />
                        </button>
                    )}
                </div>
                {idx !== foundUsers.length - 1 && <div className="divider my-2"></div>}
              </div>
            ))}
          </ul>
        </div>
      )}
      {input.trim() === '' && <Recommended />}
    </div>
  )
}

export default SearchFriends;