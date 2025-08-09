import React from 'react'
import { useEffect, useState } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBitcoin, faEthereum } from '@fortawesome/free-brands-svg-icons';
import { icon } from '@fortawesome/fontawesome-svg-core';
import solana from '../../assets/solana.svg'
import doge from '../../assets/doge.svg'
import cardano from '../../assets/cardano.svg'
import binance from '../../assets/binance.svg'
import ripple from '../../assets/ripple.svg'



function Navbar() {

  const [user, setUser] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState("Bitcoin");


  const cryptos = [
    { name: "Bitcoin", color: "#020313", icon: faBitcoin, type: "fa", setIconColor: "#ff7800" },
    { name: "Ethereum", color: "#020313", icon: faEthereum, type: "fa", setIconColor: "#deddda" },
    { name: "Solana", color: "#020313", icon: solana, type: "svg", },
    { name: "Dogecoin", color: "#020313", icon: doge, type: "svg", },
    { name: "Cardano", color: "#020313", icon: cardano, type: "svg", },
    { name: "Binance Coin", color: "#020313", icon: binance, type: "svg", },
    { name: "Polygon", color: "#020313", icon: solana, type: "svg", },
    { name: "Ripple", color: "#020313", icon: ripple, type: "svg", }
  ]


  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, [])

  return (
    <header >

      <div className='bg-[#020313] text-white h-[65px] flex items-center '>
        <nav className='flex items-center justify-between w-full'>
          <h1 className='px-5 tracking-[6px] text-2xl'>OPTO</h1>
          <ul className='flex justify-start pl-[100px] gap-11'>
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
      </div>


      <div className='bg-[#fff] py-3 px-4 overflow-x-auto scrollbar-hide '>

        <ul className='flex gap-4 min-w-max justify-between'>
          {cryptos.map((coin) => (
            <li key={coin.name}>
              <button onClick={() => setSelectedCoin(coin.name)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border-2  flex items-center gap-2 
                ${selectedCoin === coin.name ? "scale-105 shadow-md"
                    : "opacity-90 hover:opacity-100"}`}
                style={{
                  borderColor: coin.color,
                  backgroundColor:
                    selectedCoin === coin.name ? "#020313" : coin.color,
                  color:
                    "#fff"
                }}
              >
                {coin.type === "fa" && (
                  <FontAwesomeIcon
                    icon={coin.icon}
                    size='xl'
                    style={{ color: coin.setIconColor }} />
                )}

                {coin.type === "svg" && (
                  <img
                    src={coin.icon}
                    alt={coin.name}
                    style={{
                      width: "22px",
                      height: "22px",
                      filter: selectedCoin === coin.name ? "brightness(1.1)" : "brigthness(1  )",
                    }}
                  />
                )}
                {coin.name}
              </button>
            </li>
          ))}

        </ul>

      </div>
    </header>

  )
}

export default Navbar