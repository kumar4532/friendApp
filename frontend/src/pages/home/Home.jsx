import React from 'react'
import Friends from '../../components/Friends';
import SearchFriends from '../../components/SearchFriends';
import ReceivedRequests from '../../components/ReceivedRequests';
import Logout from '../../components/Logout';

function Home() {
  return (
    <div className='flex flex-col min-w-full min-h-screen'>
      <header className='p-4 flex justify-end text-2xl'>
        <Logout />
      </header>
      <main className='flex-grow flex flex-col lg:flex-row p-4 gap-8'>
        <section className='w-full lg:w-1/3'>
          <Friends />
        </section>
        <div className="hidden lg:block w-px bg-gray-200"></div>
        <section className='w-full lg:w-1/3'>
          <SearchFriends />
        </section>
        <div className="hidden lg:block w-px bg-gray-200"></div>
        <section className='w-full lg:w-1/3'>
          <ReceivedRequests />
        </section>
      </main>
    </div>
  )
}

export default Home;