import React, { useContext, useState } from "react";
import Bitcoin from "../../assets/Bitcoin.svg";
import { Context } from '../../context/context';

function Main() {

  const { showData } = useContext(Context);

  let whichCrypto;
  if (showData === "btc") {
    whichCrypto = <div className="bg-orange-500 max-w-[60vw]">a</div>;
  } else if (showData === "eth") {
    whichCrypto = <div className="bg-gray-500 max-w-[60vw]">a</div>;
  } else if (showData === "sol") {
    whichCrypto = <div className="bg-blue-500 max-w-[60vw]">a</div>; // default
  }
  else if (showData === "doge") {
    whichCrypto = <div className="bg-red-500 max-w-[60vw]">a</div>; // default
  }
  else if (showData === "card") {
    whichCrypto = <div className="bg-green-500 max-w-[60vw]">a</div>; // default
  }
  else if (showData === "bnb") {
    whichCrypto = <div className="bg-blue-500 max-w-[60vw]"></div>; // default
  }
  else if (showData === "pol") {
    whichCrypto = <div className="bg-blue-500 max-w-[60vw]"></div>; // default
  }
  else if (showData === "xrp") {
    whichCrypto = <div className="bg-blue-500 max-w-[60vw]"></div>; // default
  }

  return (
    <div className="bg-black text-white h-[100vh] flex flex-row gap-4">
      <div className="flex-1 pl-[50px] pt-[40px] max-w-[60vw] flex flex-col space-y-6">
        {showData === "all" ? <div className="flex-1 pl-[50px] pt-[40px] max-w-[60vw] flex flex-col space-y-6">

          <p className="font-bold text-2xl mb-11">All</p>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
          <div className="border border-white pl-4 pt-2 p-4 bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
            <a href="#" className="text-[12px]  rounded-full  py-1 ">
              5 Traders
            </a>
            <div className="flex flex-row justify-between">
              <p className="py-1 mb-11 ">
                Bitcoin is forecasted to reach at 121767.97 USDT or more at 08:30
                PM?
              </p>
              <img src={Bitcoin} alt="" className="w-[60px] relative  right-4" />
            </div>
            <div className="flex flex-row justify-center pt-4">
              <button className="bg-[#0064FB] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#0064FB]/90 transition-all">
                Yes
              </button>
              <button className="bg-[#FF414B] mx-5 px-5 py-2 w-[320px] rounded-md  shadow-xl hover:scale-105 hover:bg-[#FF414B]/90 transition-all">
                No
              </button>
            </div>
          </div>
        </div>
          :
          <div>
            {whichCrypto}
          </div>
        }
      </div>

      <div className="flex-1   w-[40vw] m-4 mt-[40px] border border-white bg-white/20 backdrop-blur-sm rounded-lg shadow-md">
        <p></p>
      </div>
    </div>
  );
}

export default Main;
