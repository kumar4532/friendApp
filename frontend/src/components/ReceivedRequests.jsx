import React, { useEffect, useState } from 'react'
import { MdPersonAdd } from "react-icons/md";
import { MdPersonAddDisabled } from "react-icons/md";
import useRequest from '../hooks/useRequest';

function ReceivedRequests() {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false)
  const {accept, reject} = useRequest();

  const getRequests = async() => {
    setLoading(true)
    try {
      const res = await fetch("/api/request/")

      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.log("Error while fetching requests", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getRequests();
  }, [])

  const handleAccept = async(id) => {
    await accept(id);
    setRequests(requests.filter(request => request._id !== id))
  }

  const handleReject = async(id) => {
    await reject(id);
    setRequests(requests.filter(request => request._id !== id))
  }
  
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <h1 className='text-base md:text-xl font-semibold mb-6'>Requests</h1>
      {loading ? (
        <div className='flex justify-center'>
          <div className='loading loading-spinner'></div>
        </div>
      ) : requests.length !== 0 ? (
        requests.map((request) => (
          <div key={request._id} className='mb-4'>
            <div className='flex flex-col sm:flex-row justify-between items-center py-3 px-4 sm:px-6 border rounded-lg'>
              <span className='text-base sm:text-lg mb-2 sm:mb-0'>{request.sender.fullname}</span>
              <div className='flex flex-row justify-center space-x-4 sm:space-x-6'>
                <button 
                  className='p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors'
                  onClick={() => handleAccept(request._id)}
                >
                  <MdPersonAdd className='text-xl' />
                </button>
                <button 
                  className='p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors'
                  onClick={() => handleReject(request._id)}
                >
                  <MdPersonAddDisabled className='text-xl' />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No requests have been received</p>
      )}
    </div>
  )
}

export default ReceivedRequests