import React from 'react'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

function Navbar() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [])

  return (
    <header className='bg-[#020313] text-white h-[65px] flex items-center '>
      <nav className='flex items-center justify-between w-full'>
        <h1 className='px-5 tracking-[6px] text-2xl'>OPTO</h1>
        <ul className='flex justify-start pl-[100px] gap-5'>
          <li><a href="" >Live-opinion</a></li>
          <li><a href="" >Pre-match</a></li>
          <li><a href="" >Promos</a></li>
        </ul>
        <button className='ml-[140px] mr-[40px] px-5 h-11 bg-[#fbfbff49] hover:bg-[hsla(240,100%,99%,0.2)] rounded-3xl '>
          Add Coins
        </button>

        <div className=' flex  items-center gap-4 mr-5 hover:bg-[#fbfbff49] p-2 rounded-3xl   '>
          {user && (
            <>
              {user.photoURL && (
                <img src={user.photoURL}
                  alt="User Avatar"
                  className='w-8 h-8 rounded-full' />
              )}
              <span className='text-sm '>
                <a href="#">
                  {user.displayName || user.email}
                </a>
              </span>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar