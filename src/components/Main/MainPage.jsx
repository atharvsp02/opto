import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Main from './Main';
import Footer from './Footer';
import MainBanner from './MainBanner';


export default function MainPage() {
  return (
    

    <>


      {/* Main Content */}


      <div className=" bg-black min-h-full ">
        

          <Navbar />
          <MainBanner />
          <Main />
        
      </div>


    </>
  );
}