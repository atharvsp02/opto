import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import MainBanner from './MainBanner';
import Background from './Background';

export default function MainPage() {
  return (
    // <div className="min-h-screen bg-gradient-to-r from-[#0B0C10] via-[#1F2833] to-[#0B0C10] bg-[length:200%_200%] bg-[position:0%_50%] animate-gradient relative">
    // </div>
    /* Animated Grid Background */
    /* <div className="fixed  inset-0 opacity-[0.03] pointer-events-none z-0 bg-grid animat"></div> */

    <>
      <Navbar />
      <Background>

        {/* Main Content */}
        <div className="relative z-10 ">
          <MainBanner />
          <Main />
        </div>
      </Background>
    </>
  );
}